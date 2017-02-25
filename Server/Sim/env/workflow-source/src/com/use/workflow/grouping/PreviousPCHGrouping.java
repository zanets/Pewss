package com.use.workflow.grouping;

import com.use.workflow.task.DAGDependTask;
import com.use.workflow.task.IAttribute;

public class PreviousPCHGrouping extends AGrouping implements IGrouping {
	
	@Override
	protected boolean isNewGroupEnd(IAttribute task) {
		if(task==null)
			return true;
		return false;
	}
	
	@Override
	protected int getPriorityOfChildInGroup(IAttribute task) {
		return ((DAGDependTask) task).getBottomRank()+((DAGDependTask) task).getTopRank();
	}
	
	@Override
	protected int getPriorityOfFirstTaskInGroup(IAttribute task) {
		return ((DAGDependTask) task).getBottomRank();
	}
}
