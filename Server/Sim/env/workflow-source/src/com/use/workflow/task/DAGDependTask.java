package com.use.workflow.task;

import com.use.set.TaskGroup;
import com.use.workflow.task.info.DependTaskInfo;

public class DAGDependTask extends DependTask {

	private int computationTime;
	private int bottomRank;
	private int topRank;
	private int rank;
	private long trueStartTime;
	private long trueFinishTime;
	private TaskGroup belongGroup;
	private int resourceId;
	private int groupId;
	
	public DAGDependTask(IDAG taskInfo) {
		super(taskInfo);
		this.bottomRank = 0;
		this.topRank = 0;
		this.rank = 0;
		this.trueFinishTime =0;
		this.trueStartTime = 0;
	}

	@Override
	protected void parseTaskInfo(IAttribute taskinfo) {
		DependTaskInfo info = ((DependTaskInfo)taskinfo);
		this.id = taskinfo.getId();
		this.computationTime = info.getComputationTime();
	}
	
	public long getTrueStartTime() {
		return trueStartTime;
	}

	public void setTrueStartTime(long currentTime) {
		this.trueStartTime = currentTime;
	}

	public long getTrueFinishTime() {
		return trueFinishTime;
	}

	public void setTrueFinishTime(long trueFinishTime) {
		this.trueFinishTime = trueFinishTime;
	}

	public int getBottomRank() {
		return bottomRank;
	}

	public void setBottomRank(int bottomRank) {
		this.bottomRank = bottomRank;
	}

	public int getTopRank() {
		return topRank;
	}

	public void setTopRank(int topRank) {
		this.topRank = topRank;
	}

	public int getRank() {
		return rank;
	}

	public void setRank(int rank) {
		this.rank = rank;
	}

	public int getComputationTime() {
		return computationTime;
	}

	public void setComputationTime(int computationTime) {
		this.computationTime = computationTime;
	}
	public void printInformation () {
		System.out.println("Task ID : " + id);
		System.out.println("Computation Time : " + computationTime);
		System.out.println("Bottom Rank : " + bottomRank);
		System.out.println("Top Rank : " + topRank);
		System.out.println("Rank : " + rank);
		System.out.println("EST : " + EST);
		System.out.println("EFT : " + EFT);
		System.out.println("True Start Time : " + trueStartTime);
		System.out.println("True Finish Time : " + trueFinishTime);
		if(belongRes!=null)
			System.out.println("Belong Resource : " + belongRes.getId());
		else
			System.out.println("Belong Resource : " + belongRes);
	}

	public int getResourceId() {
		return resourceId;
	}

	public void setResourceId(int resourceId) {
		this.resourceId = resourceId;
	}

	public int getGroupId() {
		return groupId;
	}

	public void setGroupId(int groupId) {
		this.groupId = groupId;
	}

	public TaskGroup getBelongGroup() {
		return belongGroup;
	}

	public void setBelongGroup(TaskGroup belongGroup) {
		this.belongGroup = belongGroup;
	}
	
}
