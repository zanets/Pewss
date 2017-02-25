package com.use.workflow.ranking;

import java.util.List;

import com.use.workflow.Workflow;
import com.use.workflow.task.DAGDependTask;
import com.use.workflow.task.IDepend;

public class AllocatedTopBottomAndBottomRank implements IRanking {

	@Override
	public void ranking(Workflow workflow) {
		List<IDepend> taskList = workflow.getCriticalPathTasksList();
		workflow.bottomRanking();
		workflow.topRanking();
		for(IDepend temp : workflow.getTaskList()) {
			DAGDependTask task = (DAGDependTask)temp;
			if(taskList.contains(task))
				task.setRank(task.getBottomRank()+task.getTopRank());
			else
				task.setRank(task.getBottomRank());
		}
	}

}
