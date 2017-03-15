package darg.scheduler;
import com.use.resource.platform.WorkflowPlatformHeterogeneous;
import java.util.List;
import com.use.set.Table;
import com.use.ALauncher;
import com.use.queue.MixQueue;
import com.use.queue.QueueType;
import com.use.queue.event.Event;
import com.use.queue.event.EventType;
import com.use.resource.GapInfo;
import com.use.resource.IResNode;
import com.use.resource.SimpleNode;
import com.use.resource.platform.WorkflowPlatformHeterogeneous;
import com.use.workflow.Workflow;
import com.use.workflow.task.DAGDependTask;
import com.use.workflow.task.IAttribute;
import com.use.workflow.task.IDepend;
import com.use.workflow.task.TaskLink;

public class TestScheduler extends com.use.scheduler.AWorkflowScheduler{
	protected WorkflowPlatformHeterogeneous platform = new WorkflowPlatformHeterogeneous();
	protected List<IAttribute> workflowSet = instance.getWaitingQ();
	protected List<IResNode> srcAttrList;

	@Override
	public void schedule() throws Exception {
		System.out.println("Hello world");
		
	}

	protected GapInfo compareGap(GapInfo bestGapInfo,GapInfo gapInfo, IAttribute task) {

		gapInfo.setBestValue(gapInfo.getEST() + this.platform.getCPTime(task.getId(), gapInfo.getResId()));
		if (bestGapInfo != null)
			bestGapInfo.setBestValue(bestGapInfo.getEST() + this.platform.getCPTime(task.getId(), bestGapInfo.getResId()));
		if (bestGapInfo == null || gapInfo.getBestValue() < bestGapInfo.getBestValue()) {
			return gapInfo;
		}
		return bestGapInfo;
	}

	@Override
	protected void resetActionQ() {
		MixQueue q = (MixQueue)instance.getQueue();
		q.cleanAction();
		for(IAttribute tmp:instance.getWaitingQ()) {
			Workflow workflow = (Workflow)tmp;
			for(IAttribute tmp2:workflow.getTaskList()) {
				DAGDependTask task = (DAGDependTask)tmp2;
				if(!task.isScheduled()&&task.isStarted())
					q.addToQueue(QueueType.Action, new Event(EventType.end,task.getId(),task.getEFT(),1,task));
			}
		}
	}

	
	

}