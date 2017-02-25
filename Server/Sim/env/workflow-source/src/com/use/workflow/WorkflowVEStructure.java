package com.use.workflow;

import java.util.ArrayList;
import java.util.List;

import com.use.workflow.task.DAGDependTask;
import com.use.workflow.task.IDepend;
import com.use.workflow.task.TaskEdge;

public class WorkflowVEStructure implements IWorkflow {

	private int id;
	private boolean isScheduled;
	private long finishTime;
	private long submitTime;
	private List<IDepend> taskList = new ArrayList<IDepend>();
	private List<TaskEdge> edgeList = new ArrayList<TaskEdge>();
	
	public WorkflowVEStructure (int id) {
		this.id = id;
	}
	
	public void printTask() {
		for(IDepend tmp : taskList) {
			System.out.println("Task id : " + tmp.getId());
			System.out.println("Computation Time : " + ((DAGDependTask) tmp).getComputationTime());
		}
	}
	
	public void printEdge() {
		System.out.println("edge Number : " + edgeList.size());
		for(TaskEdge edge : edgeList) {
			System.out.println("-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-*-");
			System.out.println("From Task : " + edge.getFromTask().getId());
			System.out.println("To Task : " + edge.getToTask().getId());
			System.out.println("Communication Time : "+ edge.getCommunication());
		}
	}
	
	
	public List<TaskEdge> getEdgeList() {
		return this.edgeList;
	}
	
	@Override
	public List<IDepend> getTaskList() {
		return this.taskList;
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
	public void setStarted(boolean isStarted) {
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
	public boolean isScheduled() {
		return this.isScheduled;
	}

	@Override
	public boolean isStarted() {
		return false;
	}

	@Override
	public long getSubmitTime() {
		return this.submitTime;
	}

	@Override
	public long getFinishTime() {
		return this.finishTime;
	}
}
