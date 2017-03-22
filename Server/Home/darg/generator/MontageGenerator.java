package darg.generator;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import com.use.config.DAGVariable;
import com.use.workflow.Workflow;
import com.use.workflow.task.DAGDependTask;
import com.use.workflow.task.IAttribute;
import com.use.workflow.task.IDepend;
import com.use.workflow.task.TaskLink;
import com.use.workflow.task.info.DependTaskInfo;
import com.use.generator.AGenerator;

public class MontageGenerator extends AGenerator {
	
	protected MontageXMLoader loader = null;


	public MontageGenerator() {
		randomNumber.setSeed(DAGVariable.getInstance().getRandomSeed());
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
			IDepend parentTask = generateSingleTask(nodeIndex++, workflow);
			workflow.getTaskList().add(parentTask);
			//loop for fork and join structure
			for(int j=0;j<DAGVariable.getInstance().getNumberOfForkJoin();j++) {
				IDepend childTask = generateDependTask(nodeIndex++,parentTask, workflow);
				workflow.getTaskList().add(childTask);
				int numberOfFirstBranch = 2+randomNumber.nextInt(DAGVariable.getInstance().getNumberOfBranch()-1);
				IDepend firstForkTask = childTask;
				List<IDepend> joinNodeForFirstFork = new ArrayList<IDepend>();
				//loop for each branch (first fork)
				for(int k=0;k<numberOfFirstBranch;k++) {
					childTask = generateDependTask(nodeIndex++,firstForkTask, workflow);
					workflow.getTaskList().add(childTask);
					int numberOfSecondBranch = 2+randomNumber.nextInt(DAGVariable.getInstance().getNumberOfBranch()-1);
					IDepend secondForkTask = childTask;
					List<IDepend> joinNodeForSecondFork = new ArrayList<IDepend>();
					//loop for each branch (second fork)
					for(int l=0;l<numberOfSecondBranch;l++) {
						childTask = generateDependTask(nodeIndex++,secondForkTask,workflow);
						workflow.getTaskList().add(childTask);
						int numberOfNodeForThisBranch = randomNumber.nextInt(DAGVariable.getInstance().getNodesForEachBranch());
						for(int m=0;m<numberOfNodeForThisBranch;m++) {
							childTask = generateDependTask(nodeIndex++, childTask,workflow);
							workflow.getTaskList().add(childTask);
						}
						joinNodeForSecondFork.add(childTask);
					}
					childTask = generateSingleTask(nodeIndex++,workflow);
					workflow.getTaskList().add(childTask);
					for(int n=0;n<numberOfSecondBranch;n++) {
						parentTask = joinNodeForSecondFork.get(n);
						generateEdge(parentTask, childTask);
					}
					joinNodeForFirstFork.add(childTask);
				}
				childTask = generateSingleTask(nodeIndex++,workflow);
				workflow.getTaskList().add(childTask);
				for(int p=0;p<numberOfFirstBranch;p++) {
					parentTask = joinNodeForFirstFork.get(p);
					generateEdge(parentTask, childTask);
				}
				childTask = generateDependTask(nodeIndex++, childTask,workflow);
				workflow.getTaskList().add(childTask);
				parentTask = childTask;
			}
			for(int q=0;q<workflowSet.size();q++) {
				Workflow workflowInSet = (Workflow)workflowSet.get(q);
				if(workflow.getInterArrivalTime()<workflowInSet.getInterArrivalTime()) {
					workflowSet.add(q, workflow);
					break;
				}				
			}
			if(!workflowSet.contains(workflow))
				workflowSet.add(workflow);
		}
		return workflowSet;
	}
	
	protected IDepend generateSingleTask (int id, Workflow workflow) {
		int computationTime = DAGVariable.getInstance().getMinComputationTime()+randomNumber.nextInt(1+DAGVariable.getInstance().getMaxComputationTime()-DAGVariable.getInstance().getMinComputationTime());
		DependTaskInfo taskInfo = new DependTaskInfo(id,computationTime);
		IDepend task = new DAGDependTask(taskInfo);
		((DAGDependTask) task).setBelongWorkflow(workflow);
		return task;
	}
	
	protected void generateEdge(IDepend parent, IDepend child) {
		float x = (1+DAGVariable.getInstance().getMaxComputationTime()-DAGVariable.getInstance().getMinComputationTime())*DAGVariable.getInstance().getCommunicationToComputationRatio();
		int maxValue = (int)x;
		int communicationTime = DAGVariable.getInstance().getMinComputationTime()+randomNumber.nextInt(maxValue);
		TaskLink parentToChildLink = new TaskLink(communicationTime, child);
		parent.getChildTaskLink().add(parentToChildLink);
		TaskLink childToParentLink = new TaskLink(communicationTime, parent);
		child.getParentTaskLink().add(childToParentLink);
	}
	
	protected IDepend generateDependTask(int id, IDepend parent, Workflow workflow) {
		IDepend child = generateSingleTask(id, workflow);
		generateEdge(parent, child);
		return child;
		
	}
}
