package com.use.scheduler;

import java.util.ArrayList;
import java.util.List;

import com.use.ALauncher;
import com.use.queue.MixQueue;
import com.use.queue.QueueType;
import com.use.queue.event.Event;
import com.use.queue.event.EventType;
import com.use.resource.GapInfo;
import com.use.resource.IResNode;
import com.use.resource.SimpleNode;
import com.use.resource.platform.WorkflowPlatformHeterogeneous;
import com.use.workflow.Workflow;
import com.use.workflow.task.DAGDependTask;
import com.use.workflow.task.IAttribute;
import com.use.workflow.task.IDepend;
import com.use.workflow.task.TaskLink;


public abstract class AListBaseWorkflowScheduler extends AWorkflowScheduler {

  protected WorkflowPlatformHeterogeneous platform = new WorkflowPlatformHeterogeneous();
	protected List<IAttribute> workflowSet = instance.getWaitingQ();
	
	@Override
	public void schedule() throws Exception {
		resetActionQ();
		platform.clonePlatform((WorkflowPlatformHeterogeneous) instance.getCluster());
		List<IAttribute> preScheduledQ = new ArrayList<IAttribute>();
		for (IAttribute tmp : workflowSet) {
			Workflow workflow = (Workflow) tmp;
			isPreScheduled = new boolean[workflow.getTaskList().size()];
			findUnStartedTaskAndAdd(workflow, preScheduledQ);
			// resource selection
			for (int i = 0; i < preScheduledQ.size();) {
				DAGDependTask task = (DAGDependTask) preScheduledQ.get(i);
				boolean isTaskParentScheduled = true;
				for (TaskLink tmp3 : task.getParentTaskLink()) {
					DAGDependTask parentTask = (DAGDependTask) tmp3
							.getNextTask();
					if (!isPreScheduled[parentTask.getId()]) {
						isTaskParentScheduled = false;
						break;
					}
				}
				if (isTaskParentScheduled) {
					GapInfo bestGap = null;
					List<IResNode> resourceList = allocatedResourceList(task);
					for (IResNode tmp4 : resourceList) {
						SimpleNode resource = (SimpleNode) tmp4;
						GapInfo gapInfo = getBestGap(task, resource);
						bestGap=compareGap(bestGap,gapInfo,task);
					}
					taskAllocation(platform.getResource(bestGap.getResId()), bestGap, task);
					isPreScheduled[task.getId()] = true;
					preScheduledQ.remove(task);
					i = 0;
				} else {
					i++;
					continue;
				}
			}
		}
	}
	protected List<IResNode> allocatedResourceList(DAGDependTask task) {
		List<IResNode> resourceList = new ArrayList<IResNode>();
		resourceList.addAll(platform.getResourcelist());
		return resourceList;
	}
	@Override
	protected void resetActionQ() {
		MixQueue q = (MixQueue)instance.getQueue();
		q.cleanAction();
		for(IAttribute tmp:instance.getWaitingQ()) {
			Workflow workflow = (Workflow)tmp;
			for(IAttribute tmp2:workflow.getTaskList()) {
				DAGDependTask task = (DAGDependTask)tmp2;
				if(!task.isScheduled()&&task.isStarted())
					q.addToQueue(QueueType.Action, new Event(EventType.end,task.getId(),task.getEFT(),1,task));
			}
		}
	}

	// put unscheduled task into prescheduledQ
	private void findUnStartedTaskAndAdd(Workflow workflow,
			List<IAttribute> list) {
		for (IDepend tmp2 : workflow.getTaskList()) {
			DAGDependTask addTask = (DAGDependTask) tmp2;
			if (addTask.isStarted()) {
				isPreScheduled[addTask.getId()] = true;
				continue;
			}
			for (int i = 0; i < list.size(); i++) {
				DAGDependTask taskInQ = (DAGDependTask) list.get(i);
				if (isAdd(addTask, taskInQ)) {
					list.add(i, addTask);
					break;
				}
			}
			if (!list.contains(addTask))
				list.add(addTask);
		}
	}

	protected void taskAllocation(IResNode tmp, GapInfo gapInfo,
			DAGDependTask task) {
		SimpleNode resource = (SimpleNode) tmp;
		// find the ready time of task on this resource
		instance.getQueue().addToQueue(
				QueueType.Action,
				new Event(EventType.end, task.getId(), gapInfo.getEST()
						+ task.getComputationTime(), 1, task));
		instance.getQueue().addToQueue(
				QueueType.Action,
				new Event(EventType.start, task.getId(), gapInfo.getEST(), 1,
						task));
		task.setEFT(gapInfo.getEST() + task.getComputationTime());
		task.setEST(gapInfo.getEST());
		task.setBelongRes(resource);
		task.setResourceId(resource.getId());
		resource.getAllocationQueue().add(gapInfo.getGapIndex(), task);
		resource.getOrderQueue().add(task);
		if (ALauncher.isLogEnable()) {
			System.err.println("Task "+task.getId()+" Allocated!");
		}
	}

	protected GapInfo getBestGap(IAttribute tmp, IResNode tmp2) {
		DAGDependTask task = (DAGDependTask) tmp;
		SimpleNode resource = (SimpleNode) tmp2;
		long taskReadyTime = 0;
		GapInfo bestGapInfo = null;
		taskReadyTime = getTaskReadyTime(task, resource.getId());
		// compute index and EFT of gap on this resource
		boolean nonGapToAllocate = true;
		for (int i = 0; i < resource.getAllocationQueue().size(); i++) {
			long startTimeOfThisGap = 0;
			long finishTimeOfThisGap = resource.getAllocationQueue().get(i)
					.getEST();
			long predictTaskStartTime;
			if (i > 0)
				startTimeOfThisGap = resource.getAllocationQueue().get(i - 1)
						.getEFT();
			if (taskReadyTime < startTimeOfThisGap)
				predictTaskStartTime = startTimeOfThisGap;
			else
				predictTaskStartTime = taskReadyTime;
			if (finishTimeOfThisGap < predictTaskStartTime
					+ task.getComputationTime())
				continue;
			else {
				nonGapToAllocate = false;
				GapInfo gapInfo = new GapInfo(i, predictTaskStartTime,
						startTimeOfThisGap, finishTimeOfThisGap);
				gapInfo.setResId(resource.getId());
				bestGapInfo = compareGap(bestGapInfo, gapInfo, task);
			}
		}
		if (nonGapToAllocate) {
			long predictTaskStartTime = 0;
			if (resource.getAllocationQueue().size() == 0
					|| taskReadyTime > resource.getAllocationQueue()
							.get(resource.getAllocationQueue().size() - 1)
							.getEFT())
				predictTaskStartTime = taskReadyTime;
			else
				predictTaskStartTime = resource.getAllocationQueue()
						.get(resource.getAllocationQueue().size() - 1).getEFT();
			bestGapInfo = new GapInfo(resource.getAllocationQueue().size(),
					predictTaskStartTime);
			bestGapInfo.setResId(resource.getId());
		}
		return bestGapInfo;
	}

	protected abstract boolean isAdd(DAGDependTask addTask,
			DAGDependTask taskInQ);

	protected abstract GapInfo compareGap(GapInfo bestGapInfo, GapInfo GapInfo,
			IAttribute task);
}
