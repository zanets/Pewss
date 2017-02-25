package com.use.workflow.task;

public class TaskEdge {
	
	private IAttribute fromTask;
	private IAttribute toTask;
	private int communicationTime;
	
	public TaskEdge (IAttribute fromTask, IAttribute toTask, int communicationTime) {
		this.fromTask = fromTask;
		this.toTask = toTask;
		this.communicationTime = communicationTime;
	}
	
	public IAttribute getFromTask() {
		return fromTask;
	}
	public void setFromTask(IAttribute fromTask) {
		this.fromTask = fromTask;
	}
	public IAttribute getToTask() {
		return toTask;
	}
	public void setToTask(IAttribute toTask) {
		this.toTask = toTask;
	}
	public int getCommunication() {
		return communicationTime;
	}
	public void setCommunication(int communication) {
		this.communicationTime = communication;
	}
	
}
