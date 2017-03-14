package test.scheduler;
import com.use.resource.GapInfo;
import com.use.workflow.task.DAGDependTask;
import com.use.workflow.task.IAttribute;

public class HEFT extends com.use.scheduler.AListBaseWorkflowScheduler {
	
	@Override
	protected boolean isAdd(DAGDependTask addTask,DAGDependTask taskInQ) {
		
		if(addTask.getRank() > taskInQ.getRank())
			return true;
		return false;
	}
	
	@Override
	protected GapInfo compareGap(GapInfo bestGapInfo,GapInfo gapInfo, IAttribute task) {
		gapInfo.setBestValue(gapInfo.getEST() + ((DAGDependTask) task).getComputationTime());
		if (bestGapInfo != null)
			bestGapInfo.setBestValue(bestGapInfo.getEST() + ((DAGDependTask) task).getComputationTime());
		if (bestGapInfo == null || gapInfo.getBestValue() < bestGapInfo.getBestValue()) {
			return gapInfo;
		}
		return bestGapInfo;
	}
}
