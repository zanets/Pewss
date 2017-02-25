package com.use.workflow.ranking;

import java.util.List;

import com.use.workflow.Workflow;
import com.use.workflow.task.DAGDependTask;
import com.use.workflow.task.IDepend;

public class AllocatedTopBottomAndBottomAmountRank extends BottomAmountRank	implements IRanking {
		
	@Override
	public void ranking(Workflow workflow) {
		List<IDepend> taskList = workflow.getCriticalPathTasksList();
		workflow.bottomRanking();
		workflow.topRanking();
		super.ranking(workflow);
		for(IDepend temp : taskList) {
			DAGDependTask task = (DAGDependTask)temp;
			task.setRank(task.getBottomRank()+task.getTopRank());
		}
	}
}
