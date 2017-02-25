package com.use.workflow.ranking;

import java.util.ArrayList;
import java.util.List;

import com.use.workflow.Workflow;
import com.use.workflow.task.DAGDependTask;
import com.use.workflow.task.IDepend;
import com.use.workflow.task.TaskLink;

public class BottomAmountRank implements IRanking {

	@Override
	public void ranking(Workflow workflow) {
		List<IDepend> taskList = workflow.getTaskList();
		boolean[] IsRank = new boolean[taskList.size()];
		List<DAGDependTask> computeRankQ = new ArrayList<DAGDependTask>();
		// if tasks have no child, add in computeRankQ
		for (IDepend iDependtask : taskList) {
			DAGDependTask task = (DAGDependTask) iDependtask;
			if (task.getChildTaskLink().size() == 0)
				computeRankQ.add(task);
		}
		while (!computeRankQ.isEmpty()) {
			DAGDependTask task = computeRankQ.get(0);
			if (task.getChildTaskLink().size() == 0)
				task.setRank(task.getComputationTime());
			else {
				int maxRank = 0;
				for (TaskLink childLink : task.getChildTaskLink()) {
					DAGDependTask childTask = (DAGDependTask) childLink
							.getNextTask();
					int rank = 0;
					if (task.getBelongRes() != null
							&& childTask.getBelongRes() != null
							&& task.getResourceId() == childTask
									.getResourceId())
						rank= childTask.getRank();
					else
						rank = childLink.getWeight()
								+ childTask.getRank();

					maxRank += rank;
				}
				maxRank += task.getComputationTime();
				task.setRank(maxRank);
			}
			IsRank[task.getId()] = true;
			computeRankQ.remove(task);
			for (TaskLink parentLink : task.getParentTaskLink()) {
				DAGDependTask parentTask = (DAGDependTask) parentLink
						.getNextTask();
				boolean allChildRank = true;
				for (TaskLink childLinkOfparentTask : parentTask
						.getChildTaskLink()) {
					DAGDependTask childOfparentTask = (DAGDependTask) childLinkOfparentTask
							.getNextTask();
					if (IsRank[childOfparentTask.getId()] == false) {
						allChildRank = false;
						break;
					}
				}
				if (!IsRank[parentTask.getId()] && allChildRank)
					computeRankQ.add(parentTask);
			}
		}
	}

}
