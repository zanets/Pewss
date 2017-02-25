package com.use.scheduler;

import java.util.ArrayList;
import java.util.List;

import com.use.queue.MixQueue;
import com.use.queue.QueueType;
import com.use.queue.event.Event;
import com.use.queue.event.EventType;
import com.use.resource.GapInfo;
import com.use.resource.IResNode;
import com.use.resource.SimpleNode;
import com.use.resource.platform.WorkflowPlatformHeterogeneous;
import com.use.set.ATaskSet;
import com.use.set.TaskGroup;
import com.use.workflow.Workflow;
import com.use.workflow.task.DAGDependTask;
import com.use.workflow.task.IAttribute;
import com.use.workflow.task.TaskLink;

public abstract class AClusteringBaseWorkflowScheduler extends AWorkflowScheduler {

	protected List<ATaskSet> preScheduledQ;
	
	@Override
	public void schedule() throws Exception {
		resetActionQ();
		WorkflowPlatformHeterogeneous platform = new WorkflowPlatformHeterogeneous();
		platform.clonePlatform((WorkflowPlatformHeterogeneous) instance.getCluster());
		List<IAttribute> workflowSet = instance.getWaitingQ();
		addStartedGroupTaskToPlatfrom(workflowSet, platform);
		for (IAttribute tmp : workflowSet) {
			Workflow workflow = (Workflow) tmp;
			isPreScheduled = new boolean[workflow.getTaskList().size()];
			preScheduledQ = new ArrayList<ATaskSet>();
			findUnStartedGroupAndAdd(workflow, preScheduledQ);
			cutGroupBeforeAllocation();
			// resource selection
			for (int i = 0; i < preScheduledQ.size();) {
				TaskGroup group = (TaskGroup) preScheduledQ.get(i);
				boolean isGroupParentScheduled = true;
				for(IAttribute tmp2 : group.getList()) {
					DAGDependTask task =(DAGDependTask)tmp2;
					for (TaskLink tmp3 : task.getParentTaskLink()) {
						DAGDependTask parentTask = (DAGDependTask) tmp3.getNextTask();
						if (!isPreScheduled[parentTask.getId()]&&!group.getList().contains(parentTask)) {
							isGroupParentScheduled = false;
							break;
						}
					}
				}
				if (isGroupParentScheduled) {
					GapInfo bestGap = null;
					for (IResNode tmp4 : platform.getResourcelist()) {
						SimpleNode resource = (SimpleNode) tmp4;
						GapInfo gapInfo = getBestGap(group, resource);
						bestGap=compareGap(bestGap,gapInfo,group);
					}
					groupAllocation(platform, bestGap, group);
					preScheduledQ.remove(group);
					i = 0;
				} else {
					i++;
					continue;
				}
			}
		}
	}
	protected void cutGroupBeforeAllocation() {
		
	}
	private void addStartedGroupTaskToPlatfrom(List<IAttribute> workflowSet, WorkflowPlatformHeterogeneous platform) {
		for(IAttribute tmp : workflowSet) {
			Workflow workflow = (Workflow)tmp;
			for(ATaskSet tmp2 : workflow.getGroupList()) {
				TaskGroup group = (TaskGroup)tmp2;
				if(group.isStarted()&&!group.isScheduled())
				for(IAttribute tmp3 : group.getList()) {
					DAGDependTask task = (DAGDependTask)tmp3;
					if(!task.isStarted()&&!task.isScheduled()) {
						addTaskToAllocationQ(task, platform.getResource(task.getResourceId()));
					}
				}
			}
		}
	}
	private void addTaskToAllocationQ(DAGDependTask task, IResNode resNode) {
		SimpleNode resource = (SimpleNode)resNode;
		for(int i=0;i<resource.getAllocationQueue().size();i++) {
			long gapStartTime = 0;
			if(i>0)
				gapStartTime = ((DAGDependTask) resource.getAllocationQueue().get(i-1)).getEFT();
			long gapFinishTime = ((DAGDependTask) resource.getAllocationQueue().get(i)).getEST();
			if(task.getEST()>gapStartTime&&task.getEFT()<gapFinishTime)
				resource.getAllocationQueue().add(i, task);
		}
		if(!resource.getAllocationQueue().contains(task))
			resource.getAllocationQueue().add(task);
		
	}
	protected GapInfo getBestGap(TaskGroup group, SimpleNode resource) {
		long groupReadyTime = 0;
		GapInfo bestGapInfo = null;
		groupReadyTime = getTaskReadyTime((DAGDependTask) group.getList().get(0), resource.getId());
		// compute index and EFT of gap on this resource
		boolean nonGapToAllocate = true;
		for (int i = 0; i < resource.getAllocationQueue().size(); i++) {
			long startTimeOfThisGap = 0;
			long finishTimeOfThisGap = resource.getAllocationQueue().get(i).getEST();
			long predictTaskStartTime;
			if (i > 0)
				startTimeOfThisGap = resource.getAllocationQueue().get(i - 1).getEFT();
			if (groupReadyTime < startTimeOfThisGap)
				predictTaskStartTime = startTimeOfThisGap;
			else
				predictTaskStartTime = groupReadyTime;
			long finishTimeOfThisGroup = getFinishTimeOfGroup(group, resource.getId(),predictTaskStartTime);			
			if (!isGapSelected(predictTaskStartTime, finishTimeOfThisGap, finishTimeOfThisGroup, group))
				continue;
			else {
				nonGapToAllocate = false;
				GapInfo gapInfo = new GapInfo(i, predictTaskStartTime,startTimeOfThisGap, finishTimeOfThisGap);
				gapInfo.setResId(resource.getId());
				bestGapInfo = compareGap(bestGapInfo, gapInfo, group);
			}
		}
		if (nonGapToAllocate) {
			long predictTaskStartTime = 0;
			if (resource.getAllocationQueue().size() == 0
					|| groupReadyTime > resource.getAllocationQueue()
							.get(resource.getAllocationQueue().size() - 1)
							.getEFT())
				predictTaskStartTime = groupReadyTime;
			else
				predictTaskStartTime = resource.getAllocationQueue().get(resource.getAllocationQueue().size() - 1).getEFT();
			bestGapInfo = new GapInfo(resource.getAllocationQueue().size(),
					predictTaskStartTime);
			bestGapInfo.setResId(resource.getId());
		}
		return bestGapInfo;
	}
	
	protected boolean isGapSelected(long predictTaskStartTime, long finishTimeOfThisGap, long finishTimeOfThisGroup, TaskGroup group) {
		if(finishTimeOfThisGap < finishTimeOfThisGroup)
			return false;
		return true;
	}
	
	protected long getFinishTimeOfGroup(ATaskSet group, int id, long startTime) {
		return getFinishTimeOfList(group.getList(), id, startTime);
	}
	protected long getFinishTimeOfList(List<IAttribute> list, int id, long startTime) {
		for(IAttribute tmp : list) {
			DAGDependTask task = (DAGDependTask)tmp;
			for(TaskLink link : task.getParentTaskLink()) {
				DAGDependTask parent = (DAGDependTask)link.getNextTask();
				long parentFinishTime=parent.getEFT();
				if(parent.getResourceId()==id)
					parentFinishTime += link.getWeight();
				if(parentFinishTime>startTime)
					startTime = parentFinishTime;
			}
			startTime +=task.getComputationTime();
		}
		return startTime;
	}
	protected void findUnStartedGroupAndAdd(Workflow workflow, List<ATaskSet> list) {
		for(ATaskSet tmp : workflow.getGroupList()) {
			TaskGroup addGroup = new TaskGroup((TaskGroup)tmp);
			if(!addGroup.isStarted()) {
				for (int i = 0; i < list.size(); i++) {
					TaskGroup taskInQ = (TaskGroup) list.get(i);
					if (isAdd(addGroup, taskInQ)) {
						list.add(i, addGroup);
						break;
					}
				}
				if(!list.contains(addGroup))
					list.add(addGroup);
			}
			else {
				for(IAttribute tmp2 : addGroup.getList()) {
					isPreScheduled[tmp2.getId()]=true;
				}
			}
		}
	}
	@Override
	protected void resetActionQ() {
		MixQueue q = (MixQueue)instance.getQueue();
		q.cleanAction();
		for(IAttribute tmp:instance.getWaitingQ()) {
			Workflow workflow = (Workflow)tmp;
			for(ATaskSet tmp2:workflow.getGroupList()) {
				TaskGroup group = (TaskGroup)tmp2;
				if(!group.isScheduled()&&group.isStarted()) {
					for (IAttribute tmp3 : group.getList()) {
						DAGDependTask task = (DAGDependTask) tmp3;
						if(!task.isScheduled()&&task.isStarted()) {
							q.addToQueue(QueueType.Action, new Event(EventType.end,task.getId(),task.getEFT(),1,task));
						}
						else if (!task.isScheduled()&&!task.isStarted()) {
							q.addToQueue(QueueType.Action, new Event(EventType.start,task.getId(),task.getEST(),1,task));
							q.addToQueue(QueueType.Action, new Event(EventType.end,task.getId(),task.getEFT(),1,task));
						}
					}
				}
			}
		}
	}
	protected boolean taskAllocation(IResNode tmp, DAGDependTask task, GapInfo bestGap) {
		long time = bestGap.getEST();
		SimpleNode resource = (SimpleNode)tmp;
		if(time < getTaskReadyTime(task, resource.getId())) {
			time = getTaskReadyTime(task, resource.getId());
		}
		if(bestGap.getGapFinishTime()!=0 && time + task.getComputationTime()>bestGap.getGapFinishTime())
			return false;
		task.setBelongRes(resource);
		task.setResourceId(resource.getId());
		task.setEST(time);
		instance.getQueue().addToQueue(
				QueueType.Action,
				new Event(EventType.start, task.getId(), time, 1, task));
		time += task.getComputationTime();
		task.setEFT(time);
		bestGap.setEST(time);
		instance.getQueue().addToQueue(
				QueueType.Action,
				new Event(EventType.end, task.getId(), time, 1, task));
		resource.getAllocationQueue().add(bestGap.getGapIndex(), task);
		bestGap.setGapIndex(bestGap.getGapIndex()+1);
		isPreScheduled[task.getId()]=true;
		return true;
	}
	protected GapInfo compareGap(GapInfo bestGapInfo, GapInfo gapInfo, ATaskSet group) {
		gapInfo.setBestValue(computeBestValue(gapInfo, group));
		if (bestGapInfo == null || gapInfo.getBestValue() < bestGapInfo.getBestValue()) {
			return gapInfo;
		}
		return bestGapInfo;
	}
	protected abstract float computeBestValue(GapInfo gapInfo, ATaskSet group);
	protected abstract boolean isAdd(ATaskSet addTask, ATaskSet taskInQ);
	protected abstract void groupAllocation(WorkflowPlatformHeterogeneous platform, GapInfo bestGap, TaskGroup group);
}
