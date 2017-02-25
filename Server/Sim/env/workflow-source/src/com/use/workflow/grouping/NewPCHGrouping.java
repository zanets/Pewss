package com.use.workflow.grouping;

import com.use.workflow.task.DAGDependTask;
import com.use.workflow.task.IAttribute;
import com.use.workflow.task.TaskLink;

public class NewPCHGrouping extends PreviousPCHGrouping implements IGrouping {

	@Override
	protected boolean isNewGroupEnd(IAttribute task) {
		if(task==null)
			return true;
		for(TaskLink link : ((DAGDependTask) task).getParentTaskLink()) {
			if(link.getNextTask()!=task && !isGrouped[link.getNextTask().getId()])
				return true;
		}
		return false;
	}
}
