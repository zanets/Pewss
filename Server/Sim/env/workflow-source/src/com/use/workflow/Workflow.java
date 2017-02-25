package com.use.workflow;

import java.util.ArrayList;
import java.util.List;

import com.use.set.ATaskSet;
import com.use.set.TaskGroup;
import com.use.workflow.task.DAGDependTask;
import com.use.workflow.task.IDepend;
import com.use.workflow.task.TaskEdge;
import com.use.workflow.task.TaskLink;


public class Workflow implements IWorkflow{

	private int id;
	private int interArrivalTime;
	private long finishTime;
	private long submitTime;
	private boolean isScheduled;
	private List<ATaskSet> groupList = new ArrayList<ATaskSet>();
	private List<IDepend> taskList = new ArrayList<IDepend>();
	
	public Workflow(int id) {
		this.id = id;
	}
	@Override
	public int getId() {
		return this.id;
	}

	@Override
	public void setScheduled(boolean isScheduled) {
		this.isScheduled = isScheduled;
	}

	@Override
	public boolean isScheduled() {
		return this.isScheduled;
	}

	@Override
	public List<IDepend> getTaskList() {
		return this.taskList;
	}
	
	public int getInterArrivalTime() {
		return this.interArrivalTime;
	}
	
	public void setInterArrivalTime(int interArrivalTime) {
		this.interArrivalTime = interArrivalTime;
	}

	public void printDAG() {
			System.out.println("********************************");
			System.out.println("workflow id : "+ this.id);
			Workflow workflow = this;
			System.out.println("inter arrival time : "+ workflow.getInterArrivalTime());
			System.out.println("number of task : "+workflow.getTaskList().size());
			for(int j=0;j<workflow.getTaskList().size();j++) {
				System.out.println("--------------------------------");
				System.out.println("*task order number : "+ j);
				DAGDependTask task = (DAGDependTask)workflow.getTaskList().get(j);
				System.out.println(" computation time : "+task.getComputationTime());
				System.out.println("*number of parents : "+ task.getParentTaskLink().size());
				for(int k=0;k<task.getParentTaskLink().size();k++) {
					System.out.print(" task: ["+ task.getParentTaskLink().get(k).getNextTask().getId()+"]");
					System.out.println(task.getParentTaskLink().get(k).getWeight());
				}
				System.out.println("*number of childs : "+ task.getChildTaskLink().size());
				for(int k=0;k<task.getChildTaskLink().size();k++) {
					System.out.print(" task: ["+ task.getChildTaskLink().get(k).getNextTask().getId()+"]");
					System.out.println(task.getChildTaskLink().get(k).getWeight());
				}
				System.out.println("--------------------------------");
			}
	}
	
	public void printAllTask() {
		for(int j=0;j<taskList.size();j++) {
			DAGDependTask task = (DAGDependTask)taskList.get(j);
			task.printInformation();
			System.out.println("--------------");
		}
	}
	
	public void printAllGroup() {
		System.out.println("Number of groups:"+groupList.size());
		for(ATaskSet tmp: groupList) {
			TaskGroup group = (TaskGroup)tmp;
			group.printGroupInformation();
			System.out.println("--------------");
		}
	}

	@Override
	public void setStarted(boolean isStarted) {
		
	}

	@Override
	public boolean isStarted() {
		return false;
	}

	@Override
	public void setFinishTime(long finishTime) {
		this.finishTime = finishTime;
	}

	@Override
	public void setSubmitTime(long submitTime) {
		this.submitTime = submitTime;
	}

	@Override
	public long getFinishTime() {
		return finishTime;
	}
	
	@Override
	public long getSubmitTime() {
		return submitTime;
	}
	
	public List<ATaskSet> getGroupList() {
		return groupList;
	}

	public void bottomRanking() {
		boolean[] IsRank = new boolean[getTaskList().size()];
		List<DAGDependTask> computeRankQ = new ArrayList<DAGDependTask>();
		// if tasks have no child, add in computeRankQ
		for (IDepend iDependtask : getTaskList()) {
			DAGDependTask task = (DAGDependTask) iDependtask;
			if (task.getChildTaskLink().size() == 0)
				computeRankQ.add(task);
		}
		while (!computeRankQ.isEmpty()) {
			DAGDependTask task = computeRankQ.get(0);
			if (task.getChildTaskLink().size() == 0)
				task.setBottomRank(task.getComputationTime());
			else {
				int maxRank = 0;
				for (TaskLink childLink : task.getChildTaskLink()) {
					DAGDependTask childTask = (DAGDependTask) childLink
							.getNextTask();
					// int rank=getRank(task, childLink);
					int rank = 0;
					if(task.getBelongRes()!=null&&childTask.getBelongRes()!=null&&task.getResourceId()==childTask.getResourceId())
						rank = task.getComputationTime()+childTask.getBottomRank();
					else
						rank = task.getComputationTime()+childLink.getWeight()+childTask.getBottomRank();
					
					if (maxRank < rank)
						maxRank = rank;
				}
				task.setBottomRank(maxRank);
			}
			IsRank[task.getId()] = true;
			computeRankQ.remove(task);
			for (TaskLink parentLink : task.getParentTaskLink()) {
				DAGDependTask parentTask = (DAGDependTask) parentLink
						.getNextTask();
				boolean allChildRank = true;
				for (TaskLink childLinkOfparentTask : parentTask
						.getChildTaskLink()) {
					DAGDependTask childOfparentTask = (DAGDependTask) childLinkOfparentTask
							.getNextTask();
					if (IsRank[childOfparentTask.getId()] == false) {
						allChildRank = false;
						break;
					}
				}
				if (!IsRank[parentTask.getId()] && allChildRank)
					computeRankQ.add(parentTask);
			}
		}
	}

	public void topRanking() {
		boolean[] IsRank = new boolean[getTaskList().size()];
		List<DAGDependTask> computeRankQ = new ArrayList<DAGDependTask>();
		for (IDepend iDependtask : getTaskList()) {
			DAGDependTask task = (DAGDependTask) iDependtask;
			if (task.getParentTaskLink().size() == 0)
				computeRankQ.add(task);
		}
		while (!computeRankQ.isEmpty()) {
			DAGDependTask task = computeRankQ.get(0);
			if (task.getParentTaskLink().size() == 0)
				task.setTopRank(0);
			else {
				int maxRank = 0;
				for (TaskLink parentLink : task.getParentTaskLink()) {
					DAGDependTask parentTask = (DAGDependTask) parentLink
							.getNextTask();
					int rank = 0;
					if(task.getBelongRes()!=null&&parentTask.getBelongRes()!=null&&task.getResourceId()==parentTask.getResourceId())
						rank = parentTask.getComputationTime()+parentTask.getTopRank();
					else
						rank = parentTask.getComputationTime()+parentLink.getWeight()+parentTask.getTopRank();
					if (maxRank < rank)
						maxRank = rank;
				}
				task.setTopRank(maxRank);
			}
			IsRank[task.getId()] = true;
			computeRankQ.remove(task);
			for (TaskLink childLink : task.getChildTaskLink()) {
				DAGDependTask childTask = (DAGDependTask) childLink
						.getNextTask();
				boolean allParentRank = true;
				for (TaskLink parentLinkOfchildTask : childTask
						.getParentTaskLink()) {
					DAGDependTask parentOfchildTask = (DAGDependTask) parentLinkOfchildTask
							.getNextTask();
					if (IsRank[parentOfchildTask.getId()] == false) {
						allParentRank = false;
						break;
					}
				}
				if (!IsRank[childTask.getId()] && allParentRank)
					computeRankQ.add(childTask);
			}
		}
	}
	
	public List<IDepend> getCriticalPathTasksList() {
		List<IDepend> criticalPathTasksList = new ArrayList<IDepend>();
		
		int criticalPathRankValue=0;
		DAGDependTask criticalPathTask=null;
		for(IDepend temp : taskList) {
			DAGDependTask task = (DAGDependTask)temp;
			if(task.getParentTaskLink().isEmpty()&&task.getBottomRank()+task.getTopRank()>criticalPathRankValue) {
				criticalPathTask = task;
				criticalPathRankValue = task.getBottomRank()+task.getTopRank();
			}
		}
		while(criticalPathTask!=null) {
			criticalPathTasksList.add(criticalPathTask);
			if(criticalPathTask.getChildTaskLink().isEmpty()) {
				criticalPathTask=null;
			}
			else {
				for(TaskLink temp2 : criticalPathTask.getChildTaskLink()) {
					DAGDependTask child = (DAGDependTask)temp2.getNextTask();
					if(child.getBottomRank()+child.getTopRank()==criticalPathRankValue) {
						criticalPathTask = child;
					}
				}
			}
		}
		
		return criticalPathTasksList;
	}
	
	public WorkflowVEStructure convertStructure() {
		WorkflowVEStructure TDG = new WorkflowVEStructure(id);
		TDG.getTaskList().addAll(taskList);
		boolean[] isCheck = new boolean[taskList.size()];
		List<DAGDependTask> checkQueue = new ArrayList<DAGDependTask>();
		DAGDependTask task = null;
		for(IDepend tmp : taskList) {
			DAGDependTask checkTask = (DAGDependTask)tmp;
			if(checkTask.getParentTaskLink().isEmpty())
				task = checkTask;
		}
		checkQueue.add(task);
		while(!checkQueue.isEmpty()) {
			task = checkQueue.remove(0);
			isCheck[task.getId()] = true;
			for(TaskLink tmp: task.getChildTaskLink()) {
				DAGDependTask child = (DAGDependTask)tmp.getNextTask();
				TDG.getEdgeList().add(new TaskEdge(task, child, tmp.getWeight()));
				if(!isCheck[child.getId()]&&!checkQueue.contains(child)) {
					checkQueue.add(child);
				}
			}
		}
		return TDG;
	}
}
