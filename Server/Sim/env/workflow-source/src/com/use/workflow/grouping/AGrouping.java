package com.use.workflow.grouping;

import java.util.ArrayList;
import java.util.List;

import com.use.set.TaskGroup;
import com.use.workflow.IWorkflow;
import com.use.workflow.Workflow;
import com.use.workflow.task.DAGDependTask;
import com.use.workflow.task.IAttribute;
import com.use.workflow.task.IDepend;
import com.use.workflow.task.TaskLink;

public abstract class AGrouping implements IGrouping {
	protected boolean isGrouped[];
	@Override
	public void grouping(Workflow workflow) {
		workflow.getGroupList().clear();
		isGrouped = new boolean[workflow.getTaskList().size()];
		for(IDepend tmp : workflow.getTaskList()) {
			DAGDependTask task = (DAGDependTask)tmp;
			if(task.isScheduled()) {
				isGrouped[task.getId()]=true;
			}
		}
		while(!isAllTasksGrouped()) {
			IAttribute task=findHigherPriorityAndUnScheduledTask(workflow);
			TaskGroup newGroup=new TaskGroup(workflow.getGroupList().size());
			newGroup.setBelongWorkflow(workflow);
			do {
				newGroup.addTask(task);
				((DAGDependTask) task).setGroupId(newGroup.getId());
				((DAGDependTask) task).setBelongGroup(newGroup);
				isGrouped[task.getId()]=true;
				task = findHigherPriorityAndUnScheduledTask(task);
				
			}while(!isNewGroupEnd(task));
			workflow.getGroupList().add(newGroup);
		}
	}
	protected IAttribute findHigherPriorityAndUnScheduledTask(IAttribute attribute) {
		IAttribute higherPriorityTask=null;
		List<IAttribute> checkList = new ArrayList<IAttribute>();
		if(attribute instanceof IWorkflow) {
			Workflow workflow = (Workflow)attribute;
			for(IDepend tmp : workflow.getTaskList()) {
				if(!isGrouped[tmp.getId()])
					checkList.add(tmp);
			}
		}
		else if (attribute instanceof IDepend) {
			DAGDependTask task = (DAGDependTask)attribute;
			for(TaskLink tmp : task.getChildTaskLink()) {
				if(!isGrouped[tmp.getNextTask().getId()])
					checkList.add(tmp.getNextTask());
			}
		}
		int maxPriority=0;
		for(IAttribute tmp : checkList) {
			DAGDependTask task = (DAGDependTask)tmp;
			if(attribute instanceof IWorkflow && getPriorityOfFirstTaskInGroup(task)>maxPriority) {
				maxPriority = getPriorityOfFirstTaskInGroup(task);
				higherPriorityTask = task;
			}
			else if (attribute instanceof IDepend && getPriorityOfChildInGroup(task)>maxPriority) {
				maxPriority = getPriorityOfChildInGroup(task);
				higherPriorityTask = task;
			}
		}
		return higherPriorityTask;
	}
	private boolean isAllTasksGrouped() {
		boolean isAllGrouped=true;
		for(int i=0;i<isGrouped.length;i++) {
			if(!isGrouped[i])
				isAllGrouped = false;
		}
		return isAllGrouped;
	}
	protected abstract int getPriorityOfChildInGroup(IAttribute task);
	protected abstract int getPriorityOfFirstTaskInGroup(IAttribute task);
	protected abstract boolean isNewGroupEnd(IAttribute task);
}
