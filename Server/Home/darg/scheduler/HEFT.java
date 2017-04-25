package darg.scheduler;

import java.util.ArrayList;
import java.util.List;
import java.util.Collections;  
import java.util.Comparator; 
import java.util.List;
import java.util.Map;
import com.use.resource.IResNode;
import com.use.resource.SimpleNode;
import com.darg.platform.WorkflowPlatform;
import com.use.workflow.Workflow;
import com.use.workflow.task.DAGDependTask;
import com.use.workflow.task.IAttribute;
import com.use.workflow.task.IDepend;
import com.use.resource.GapInfo;
import com.use.workflow.task.DAGDependTask;
import com.use.workflow.task.IAttribute;
import com.use.scheduler.AListBaseWorkflowScheduler;

public class HEFT extends AListBaseWorkflowScheduler
{

	public HEFT()
	{
		super();
	}
	

	public void schedule() throws Exception
	{
		this.initialize();
		for(IAttribute _wf : this.workflowSet)
		{
			Workflow wf = (Workflow) _wf;
			this.platform.genCPTimes(wf.getTaskList());

			// task ranking
			List<IDepend> tasks = this.getRankTask(wf);

			// since its sorted, just loop it
			for(IDepend _task : tasks)
			{
				DAGDependTask task = (DAGDependTask) _task;

				// get gap and resource with minimize EFT
				GapInfo gap = this.getBestGap(task);
				IResNode res = platform.getResource(gap.getResId());

				// allocate task
				task.setComputationTime(this.platform.getCPTime(task.getId(), res.getId()));
				this.taskAllocation(res, gap, task);			
			}
		}
	
	}

	public List<IDepend> getRankTask(Workflow wf)
	{
		wf.bottomRanking();
		List<IDepend> tasks = wf.getTaskList();

		// sort with bottom rank
		Collections.sort(tasks, new Comparator<IDepend>(){
			public int compare(IDepend t1, IDepend t2) {
				return ((DAGDependTask) t2).getBottomRank() 
					- ((DAGDependTask) t1).getBottomRank();
			}
		});
		

		return tasks;
	}

	public GapInfo getBestGap(IDepend task)
	{
		GapInfo best = null;
		for (IResNode _res : this.platform.getResourcelist()) 
		{
			// get gap with minimum EFT of resource
			GapInfo gap = this.getBestGap(task, (SimpleNode) _res);

			// get gap with minimum EFT among resources
			best = this.compareGap(best, gap, task);
		}
		return best;
	}
}