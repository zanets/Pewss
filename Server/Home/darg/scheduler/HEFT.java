package darg.scheduler;

import java.util.ArrayList;
import java.util.List;
import java.util.Collections;  
import java.util.Comparator; 
import java.util.List;
import java.util.Map;
import com.use.resource.IResNode;
import com.use.resource.SimpleNode;
import com.use.resource.platform.WorkflowPlatform;
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

		for(IAttribute iwf : this.workflowSet)
		{
			Workflow wf = (Workflow) iwf;

			// task ranking
			List<IDepend> tasks = this.getRankTask(wf);
			
			// since its sorted, just loop it
			for(IDepend itask : tasks)
			{
				DAGDependTask task = (DAGDependTask) itask;
				
				// get gap and resource with minimize EFT
				GapInfo gap = this.getBestGap(task);
				IResNode res = this.platform.getResource(gap.getResId());

				// allocate task
				this.taskAllocation(res, gap, task);	
			}
			
		}
	
	}

	public List<IDepend> getRankTask(Workflow wf)
	{
		wf.bottomRanking();
		List<IDepend> tasks = wf.getTaskList();

		// sort with bottom rank
		Collections.sort(tasks, new Comparator<IDepend>()
		{
			public int compare(IDepend t1, IDepend t2) 
			{
				return ((DAGDependTask) t2).getBottomRank() 
					- ((DAGDependTask) t1).getBottomRank();
			}
		});
		

		return tasks;
	}

	public GapInfo getBestGap(IDepend task)
	{
		GapInfo best = null;
		for (IResNode ires : this.platform.getResourcelist()) 
		{
			// get gap with minimum EFT of resource
			GapInfo gap = this.getBestGap(task, (SimpleNode) ires);
			
			best = compareGap(best, gap, task);
		}
		
		return best;
	}
}