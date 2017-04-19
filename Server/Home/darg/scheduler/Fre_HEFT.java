package darg.scheduler;
import java.util.ArrayList;
import java.util.List;

import com.use.ALauncher;
import com.use.queue.MixQueue;
import com.use.queue.QueueType;
import com.use.queue.event.Event;
import com.use.queue.event.EventType;
import com.use.resource.GapInfo;
import com.use.resource.IResNode;
import com.use.resource.SimpleNode;
import darg.platform.WorkflowPlatform;
import com.use.workflow.Workflow;
import com.use.workflow.task.DAGDependTask;
import com.use.workflow.task.IAttribute;
import com.use.workflow.task.IDepend;
import com.use.workflow.task.TaskLink;
import com.use.resource.GapInfo;
import com.use.workflow.task.DAGDependTask;
import com.use.workflow.task.IAttribute;

public class Fre_HEFT extends com.use.scheduler.AListBaseWorkflowScheduler {

	@Override
	public void schedule() throws Exception 
	{
		this.initialize();
		List<IAttribute> preScheduledQ = new ArrayList<IAttribute>();
		for (IAttribute tmp : workflowSet) {
			Workflow workflow = (Workflow) tmp;
			isPreScheduled = new boolean[workflow.getTaskList().size()];
			this.platform.genCPTimes(workflow.getTaskList());
			findUnStartedTaskAndAdd(workflow, preScheduledQ);
			// resource selection
			for (int i = 0; i < preScheduledQ.size();) {
				DAGDependTask task = (DAGDependTask) preScheduledQ.get(i);

				boolean isTaskParentScheduled = true;
				for (TaskLink tmp3 : task.getParentTaskLink()) {
					DAGDependTask parentTask = (DAGDependTask) tmp3.getNextTask();
					if (!isPreScheduled[parentTask.getId()]) {
						isTaskParentScheduled = false;
						break;
					}
				}
				if (isTaskParentScheduled) {
					GapInfo bestGap = null;
					List<IResNode> resourceList = allocatedResourceList(task);
					for (IResNode tmp4 : resourceList) {
						SimpleNode resource = (SimpleNode) tmp4;
						GapInfo gapInfo = getBestGap(task, resource);
						bestGap=compareGap(bestGap,gapInfo,task);
					}
					taskAllocation(platform.getResource(bestGap.getResId()), bestGap, task);
					
					isPreScheduled[task.getId()] = true;
					preScheduledQ.remove(task);
					i = 0;
				} else {
					i++;
					continue;
				}
			}
		}
	}

	

	
	
	
}
