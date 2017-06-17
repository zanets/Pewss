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

public class CustomGenerator extends AGenerator 
{

	public ArrayList<DAGDependTask> getTasks(Workflow wk)
	{
		ArrayList<DAGDependTask> tasks = new ArrayList<DAGDependTask>();
		for(int i=0; i<11; i++)
			tasks.add(new DAGDependTask(new DependTaskInfo(i, -1)));
	 
		tasks.get(0).getChildTaskLink().add(new TaskLink(27, tasks.get(1)));    
		tasks.get(0).setComputationTime(28);

		tasks.get(1).getChildTaskLink().add(new TaskLink(22, tasks.get(2)));
		tasks.get(1).getChildTaskLink().add(new TaskLink(6, tasks.get(3)));
		tasks.get(1).getParentTaskLink().add(new TaskLink(27, tasks.get(0)));
		tasks.get(1).setComputationTime(29);

		tasks.get(2).getChildTaskLink().add(new TaskLink(1, tasks.get(4)));
		tasks.get(2).getChildTaskLink().add(new TaskLink(18, tasks.get(5)));
		tasks.get(2).getParentTaskLink().add(new TaskLink(22, tasks.get(1)));
		tasks.get(2).setComputationTime(23);

		tasks.get(3).getChildTaskLink().add(new TaskLink(13, tasks.get(6)));
		tasks.get(3).getChildTaskLink().add(new TaskLink(7, tasks.get(7)));
		tasks.get(3).getParentTaskLink().add(new TaskLink(6, tasks.get(1)));
		tasks.get(3).setComputationTime(1);

		tasks.get(4).getChildTaskLink().add(new TaskLink(4, tasks.get(8)));
		tasks.get(4).getParentTaskLink().add(new TaskLink(1, tasks.get(2)));
		tasks.get(4).setComputationTime(2);

		tasks.get(5).getChildTaskLink().add(new TaskLink(4, tasks.get(8)));
		tasks.get(5).getParentTaskLink().add(new TaskLink(18, tasks.get(2)));
		tasks.get(5).setComputationTime(26);

		tasks.get(6).getChildTaskLink().add(new TaskLink(28, tasks.get(9)));
		tasks.get(6).getParentTaskLink().add(new TaskLink(13, tasks.get(3)));
		tasks.get(6).setComputationTime(14);

		tasks.get(7).getChildTaskLink().add(new TaskLink(11, tasks.get(9)));
		tasks.get(7).getParentTaskLink().add(new TaskLink(7, tasks.get(3)));
		tasks.get(7).setComputationTime(9);

		tasks.get(8).getChildTaskLink().add(new TaskLink(13, tasks.get(10)));
		tasks.get(8).getParentTaskLink().add(new TaskLink(4, tasks.get(4)));
		tasks.get(8).getParentTaskLink().add(new TaskLink(4, tasks.get(5)));
		tasks.get(8).setComputationTime(29);

		tasks.get(9).getChildTaskLink().add(new TaskLink(9, tasks.get(10)));
		tasks.get(9).getParentTaskLink().add(new TaskLink(28, tasks.get(6)));
		tasks.get(9).getParentTaskLink().add(new TaskLink(11, tasks.get(7)));
		tasks.get(9).setComputationTime(13);

		tasks.get(10).getParentTaskLink().add(new TaskLink(13, tasks.get(8)));
		tasks.get(10).getParentTaskLink().add(new TaskLink(18, tasks.get(9)));
		tasks.get(10).setComputationTime(28);

		for(DAGDependTask task : tasks)
				task.setBelongWorkflow(wk);

		return tasks;
	}

	@Override
	public List<IAttribute> generate() throws Exception 
	{
		List<IAttribute> workflowSet = new ArrayList<IAttribute>();
		//loop for generating workflow
		for(int i = 0; i < DAGVariable.getInstance().getNumberOfWorkflow(); i++ )
		{
			int nodeIndex = 0;
			Workflow workflow = new Workflow(i);
			workflow.setInterArrivalTime(0);
			ArrayList<DAGDependTask> tasks = this.getTasks(workflow);

			for(IDepend task : tasks)
			{
				workflow.getTaskList().add(task);
			}
			
			for(int q = 0; q < workflowSet.size(); q++) 
			{
				Workflow workflowInSet = (Workflow) workflowSet.get(q);
				if( workflow.getInterArrivalTime() < workflowInSet.getInterArrivalTime() ) 
				{
					workflowSet.add(q, workflow);
					break;
				}				
			}

			if( !workflowSet.contains(workflow) )
			{
				workflowSet.add(workflow);
			}
		}
		return workflowSet;
	}

}
	 
