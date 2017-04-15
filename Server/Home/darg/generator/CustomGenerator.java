package darg.generator;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import com.use.generator.AGenerator;
import com.use.config.DAGVariable;
import com.use.workflow.Workflow;
import com.use.workflow.task.DAGDependTask;
import com.use.workflow.task.IAttribute;
import com.use.workflow.task.IDepend;
import com.use.workflow.task.TaskLink;
import com.use.workflow.task.info.DependTaskInfo;

public class CustomGenerator extends AGenerator {
	private Random randomNumber = new Random();	

	public CustomGenerator() {
		randomNumber.setSeed(DAGVariable.getInstance().getRandomSeed());
	}

	public ArrayList<DAGDependTask> getTasks(Workflow wk){
		ArrayList<DAGDependTask> tasks = new ArrayList<DAGDependTask>();
		for(int i=0; i<10; i++)
			tasks.add(new DAGDependTask(new DependTaskInfo(i, -1)));
	 
		tasks.get(0).getChildTaskLink().add(new TaskLink(17, tasks.get(1)));    
		tasks.get(0).getChildTaskLink().add(new TaskLink(31, tasks.get(2)));    
		tasks.get(0).getChildTaskLink().add(new TaskLink(29, tasks.get(3)));    
		tasks.get(0).getChildTaskLink().add(new TaskLink(13, tasks.get(4)));    
		tasks.get(0).getChildTaskLink().add(new TaskLink(7, tasks.get(5)));
		
		tasks.get(1).getChildTaskLink().add(new TaskLink(3, tasks.get(7)));
		tasks.get(1).getChildTaskLink().add(new TaskLink(30, tasks.get(8)));
		tasks.get(1).getParentTaskLink().add(new TaskLink(17, tasks.get(0)));
		
		tasks.get(2).getChildTaskLink().add(new TaskLink(16, tasks.get(6)));
		tasks.get(2).getParentTaskLink().add(new TaskLink(31, tasks.get(0)));

		tasks.get(3).getChildTaskLink().add(new TaskLink(11, tasks.get(7)));
		tasks.get(3).getChildTaskLink().add(new TaskLink(7, tasks.get(8)));
		tasks.get(3).getParentTaskLink().add(new TaskLink(29, tasks.get(0)));

		tasks.get(4).getChildTaskLink().add(new TaskLink(57, tasks.get(8)));
		tasks.get(4).getParentTaskLink().add(new TaskLink(13, tasks.get(0)));

		tasks.get(5).getChildTaskLink().add(new TaskLink(5, tasks.get(7)));
		tasks.get(5).getParentTaskLink().add(new TaskLink(7, tasks.get(0)));

		tasks.get(6).getChildTaskLink().add(new TaskLink(9, tasks.get(9)));
		tasks.get(6).getParentTaskLink().add(new TaskLink(16, tasks.get(2)));

		tasks.get(7).getChildTaskLink().add(new TaskLink(42, tasks.get(9)));
		tasks.get(7).getParentTaskLink().add(new TaskLink(3, tasks.get(1)));
		tasks.get(7).getParentTaskLink().add(new TaskLink(11, tasks.get(3)));
		tasks.get(7).getParentTaskLink().add(new TaskLink(5, tasks.get(5)));

		tasks.get(8).getChildTaskLink().add(new TaskLink(7, tasks.get(9)));
		tasks.get(8).getParentTaskLink().add(new TaskLink(30, tasks.get(1)));
		tasks.get(8).getParentTaskLink().add(new TaskLink(7, tasks.get(3)));
		tasks.get(8).getParentTaskLink().add(new TaskLink(57, tasks.get(4)));

		tasks.get(9).getParentTaskLink().add(new TaskLink(9, tasks.get(6)));
		tasks.get(9).getParentTaskLink().add(new TaskLink(42, tasks.get(7)));
		tasks.get(9).getParentTaskLink().add(new TaskLink(7, tasks.get(8)));

		for(DAGDependTask task : tasks)
				task.setBelongWorkflow(wk);

		return tasks;
	}

	@Override
	public List<IAttribute> generate() throws Exception {
		List<IAttribute> workflowSet = new ArrayList<IAttribute>();
		//loop for generating workflow
		for(int i=0;i<DAGVariable.getInstance().getNumberOfWorkflow();i++) {
			int nodeIndex = 0;
			Workflow workflow = new Workflow(i);
			//random interarrival time for workflow
			workflow.setInterArrivalTime(randomNumber.nextInt(DAGVariable.getInstance().getMaxInterArrivalTime()));
			ArrayList<DAGDependTask> tasks = this.getTasks(workflow);
			for(IDepend task : tasks){
				workflow.getTaskList().add(task);
			}
			
			for(int q=0;q<workflowSet.size();q++) {
				Workflow workflowInSet = (Workflow)workflowSet.get(q);
				if(workflow.getInterArrivalTime()<workflowInSet.getInterArrivalTime()) {
					workflowSet.add(q, workflow);
					break;
				}				
			}

			if(!workflowSet.contains(workflow)){
				workflowSet.add(workflow);
			}
		}
		return workflowSet;
	}

}
	 
