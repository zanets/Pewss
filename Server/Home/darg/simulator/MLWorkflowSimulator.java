package darg.simulator;

import java.util.ArrayList;
import java.util.List;

import com.use.ALauncher;
import com.use.config.DAGVariable;
import com.use.queue.MixQueue;
import com.use.queue.QueueType;
import com.use.queue.event.Event;
import com.use.queue.event.EventType;
import com.use.resource.SimpleNode;
import com.use.workflow.IWorkflow;
import com.use.workflow.Workflow;
import com.use.workflow.task.DAGDependTask;
import com.use.workflow.task.IAttribute;
import com.use.workflow.task.IDepend;
import darg.utils.Fetcher;
import darg.utils.CSVFetcher;

// WorkflowSimulator for Machine Learning
public class MLWorkflowSimulator extends com.use.simulator.StaticWorkflowSimulator {
	
	private Fetcher MetaFetcher = null;
	public MLWorkflowSimulator() throws Exception {
		super();
		this.MetaFetcher = CSVFetcher.getInstance();
	}

	@Override
	protected void submitTaskEvent() throws Exception {
		for (int i = 0; i < fullTaskList.size(); i++) {
			Workflow workflow = (Workflow) fullTaskList.get(i);
			this.MetaFetcher.fetch(workflow.getAvgComputationTime());
			workflow.bottomRanking();
			workflow.topRanking();
			DAGVariable.getInstance().getRanking().ranking(workflow);
			DAGVariable.getInstance().getGrouping().grouping(workflow);
			queue.addToQueue( QueueType.Event, new Event(EventType.submit,
					workflow.getId(),
					workflow.getInterArrivalTime(),
					1,
					workflow
					) );
		}
	}

	@Override
	protected void simulateFinish() throws Exception {
		float sumMakespansOfWorkflow=0;

		for(IAttribute tmp : this.getWaitingQ()) {
			Workflow workflow = (Workflow)tmp;
			sumMakespansOfWorkflow+=workflow.getFinishTime();
			sumMakespansOfWorkflow-=workflow.getInterArrivalTime();
			
			// System.out.println(darg.helper.workflow_to_json(workflow));
			this.MetaFetcher.fetch(DAGVariable.getInstance().getCommunicationToComputationRatio());
			this.MetaFetcher.fetch(DAGVariable.getInstance().getNumberOfResource());
			this.MetaFetcher.fetch(workflow.getTaskList().size());
			this.MetaFetcher.fetch(workflow.getCriticalPathTasksList().size());
			this.MetaFetcher.fetch(workflow.getAvgChildAmount());
			this.MetaFetcher.fetch(workflow.getAvgParentAmount());

			// ======= constant
			this.MetaFetcher.fetch(workflow.getFinishTime() - workflow.getInterArrivalTime()); // makespan
			this.MetaFetcher.print();
			this.MetaFetcher.clear();
		}
		
	}
}
