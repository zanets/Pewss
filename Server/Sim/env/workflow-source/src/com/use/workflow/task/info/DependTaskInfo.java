package com.use.workflow.task.info;

import java.util.List;

import com.use.resource.IResNode;
import com.use.workflow.IWorkflow;
import com.use.workflow.task.IDAG;
import com.use.workflow.task.TaskLink;

public class DependTaskInfo implements IDAG {

	private int id;
	private int computationTime;
	
	
	public DependTaskInfo(int id, int computationTime) {
		this.id = id;
		this.computationTime = computationTime;
	}


	public int getComputationTime() {
		return computationTime;
	}


	public void setComputationTime(int computationTime) {
		this.computationTime = computationTime;
	}


	public void setId(int id) {
		this.id = id;
	}


	@Override
	public List<TaskLink> getParentTaskLink() {
		// TODO Auto-generated method stub
		return null;
	}


	@Override
	public List<TaskLink> getChildTaskLink() {
		// TODO Auto-generated method stub
		return null;
	}


	@Override
	public long getEST() {
		// TODO Auto-generated method stub
		return 0;
	}


	@Override
	public void setEST(long EST) {
		// TODO Auto-generated method stub
		
	}


	@Override
	public long getEFT() {
		// TODO Auto-generated method stub
		return 0;
	}


	@Override
	public void setEFT(long EFT) {
		// TODO Auto-generated method stub
		
	}


	@Override
	public int getId() {
		// TODO Auto-generated method stub
		return id;
	}


	@Override
	public void setScheduled(boolean isScheduled) {
		
	}


	@Override
	public boolean isScheduled() {
		return false;
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
		
	}


	@Override
	public void setSubmitTime(long submitTime) {
		
	}


	@Override
	public long getSubmitTime() {
		return 0;
	}


	@Override
	public long getFinishTime() {
		return 0;
	}


	@Override
	public <Node extends IResNode> Node getBelongRes() {
		// TODO Auto-generated method stub
		return null;
	}


	@Override
	public <Node extends IResNode> void setBelongRes(Node belongRes) {
		// TODO Auto-generated method stub
		
	}


	@Override
	public IWorkflow getBelongWorkflow() {
		// TODO Auto-generated method stub
		return null;
	}


	@Override
	public void setBelongWorkflow(IWorkflow belongWorkflow) {
		// TODO Auto-generated method stub
		
	}
	
	
	
	

}
