package com.use.set;

import java.util.ArrayList;

import com.use.workflow.Workflow;
import com.use.workflow.task.DAGDependTask;
import com.use.workflow.task.IAttribute;
import com.use.workflow.task.TaskLink;

public class TaskGroup extends ATaskSet {

	private int id;
	private int groupComputationTime;
	private Workflow belongWorkflow;
	private int resId;
	
	public TaskGroup(TaskGroup group) {
		list = new ArrayList<IAttribute>();
		this.id = group.id;
		this.groupComputationTime = group.groupComputationTime;
		this.belongWorkflow = group.belongWorkflow;
		this.resId = group.resId;
		this.list.addAll(group.list);
	}
	
	public TaskGroup(int id) {
		this.id = id;
		this.groupComputationTime=0;
		this.belongWorkflow=null;
		list = new ArrayList<IAttribute>();
	}
	
	public void addTask(IAttribute task) {
		if(task!=null) {
			list.add(task);
			groupComputationTime+=((DAGDependTask) task).getComputationTime();
		}
		else
			System.err.println("#Group["+id+"] the added task is null");
	}
	
	public boolean contains(IAttribute task) {
		return list.contains(task);
	}
	
	public IAttribute removeTask(int index) {
		DAGDependTask task=null;
		if(list.isEmpty())
			System.err.println("#Group["+id+"]# The Group is empty");
		else {
			task = (DAGDependTask)list.remove(index);
			groupComputationTime-=task.getComputationTime();
		}
		return task;
	}
	
	public void removeTask(IAttribute task) {
		boolean isRemove = list.remove(task);
		if(isRemove)
			groupComputationTime-=((DAGDependTask) task).getComputationTime();
		else
			System.err.println("#Group["+id+"]# The remove task is not in this Group");
	}
	
	@Override
	protected void initilizedList() {
		
	}

	public int getGroupComputationTime() {
		return groupComputationTime;
	}

	public Workflow getBelongWorkflow() {
		return belongWorkflow;
	}

	public void setBelongWorkflow(Workflow belongWorkflow) {
		this.belongWorkflow = belongWorkflow;
	}

	public int getId() {
		return id;
	}

	public boolean isScheduled() {
		boolean isScheduled=false;
		if(!list.isEmpty())
			isScheduled = list.get(list.size()-1).isScheduled();
		return isScheduled;
	}

	public boolean isStarted() {
		boolean isStarted=false;
		if(!list.isEmpty())
			isStarted = list.get(0).isStarted();
		return isStarted;
	}

	public int getResId() {
		return resId;
	}

	public void setResId(int resId) {
		this.resId = resId;
	}

	public boolean isAllTaskParentsScheduled() {
		boolean isParentsScheduled = true;
		for(IAttribute tmp : list) {
			DAGDependTask task = (DAGDependTask)tmp;
			for(TaskLink tmp2 : task.getParentTaskLink()) {
				DAGDependTask parent = (DAGDependTask)tmp2.getNextTask();
				if(!parent.isScheduled()&&!list.contains(parent)) {
					isParentsScheduled = false;
				}
			}
		}
		return isParentsScheduled;
	}
	
	public void printGroupInformation() {
		System.out.println("Group#"+id);
		System.out.print("Task");
		for(IAttribute tmp : list) {
			System.out.print(" "+tmp.getId());
		}
		System.out.println();
		System.out.println("ComputationTime:"+groupComputationTime);
		System.out.println("Belong Resource:"+resId);
	}

}
