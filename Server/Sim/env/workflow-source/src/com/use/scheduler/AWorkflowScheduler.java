package com.use.scheduler;

import com.use.simulator.ASimulator;
import com.use.simulator.StaticWorkflowSimulator;
import com.use.workflow.Workflow;
import com.use.workflow.task.DAGDependTask;
import com.use.workflow.task.TaskLink;

public abstract class AWorkflowScheduler extends AScheduler {
	protected StaticWorkflowSimulator instance = (StaticWorkflowSimulator) ASimulator.getInstance();
	protected boolean isPreScheduled[];
	protected abstract void resetActionQ();
	
	@Override
	public abstract void schedule() throws Exception;
	
	protected long getTaskReadyTime(DAGDependTask task, int resourceIndex) {
		long taskReadyTime = 0;
		if (task.getParentTaskLink().size() == 0) {
			taskReadyTime = ((Workflow)task.getBelongWorkflow()).getInterArrivalTime();
		} else {
			for (TaskLink parentLink : task.getParentTaskLink()) {
				DAGDependTask parentTask = (DAGDependTask) parentLink
						.getNextTask();
				long predictReadyTimeOfThisParent = parentTask.getEFT();
				if (parentTask.getResourceId() != resourceIndex) {
					predictReadyTimeOfThisParent += parentLink.getWeight();
				}
				if (predictReadyTimeOfThisParent > taskReadyTime)
					taskReadyTime = predictReadyTimeOfThisParent;
			}
		}
		return taskReadyTime;
	}
	

}
