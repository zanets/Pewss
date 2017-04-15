package darg.generator;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.Collections;  
import java.util.Comparator; 

import com.use.config.DAGVariable;
import com.use.workflow.Workflow;
import com.use.workflow.task.DAGDependTask;
import com.use.workflow.task.IAttribute;
import com.use.workflow.task.IDepend;
import com.use.workflow.task.TaskLink;
import com.use.workflow.task.info.DependTaskInfo;
import com.use.generator.AGenerator;

public final class MontageGenerator extends AGenerator {
	
	private Random rd = null;
	private ISynthLoader loader = null;
	private DAGVariable va = null;

	public MontageGenerator() {
		super();
		this.va = DAGVariable.getInstance();
		this.loader = new SynthLoader();
		this.rd = new Random(this.va.getRandomSeed());
	}
	
	public List<IAttribute> generate() throws Exception{

		try {
			this.loader.open("SyntheticWorkflows/MONTAGE/MONTAGE.n.100.0.dax");
		} catch (Exception ex){
			ex.printStackTrace();
			return null;
		}

		List<IAttribute> wfs = new ArrayList<IAttribute>();
		
		// TODO: the for-loop use same xml file
		// consider loading different xml file by 
		// differnt task amount from DAGVariable. 
		for(int wfid=0; wfid<this.va.getNumberOfWorkflow(); wfid++){

			// create workflow
			Workflow wf = new Workflow(wfid);
			
			wf.setInterArrivalTime(
				// this.rd.nextInt(this.va.getMaxInterArrivalTime())
				0
			);
			
			// create tasks
			int cur = 0;
			while((cur = this.loader.cursor(cur)) > 0){
				DAGDependTask task = new DAGDependTask(
					new DependTaskInfo(
						this.loader.getId(),
						(int) this.loader.getCpTime()
					)
				);
				task.setBelongWorkflow(wf);
				wf.getTaskList().add(task);
			}

			// create edge
			for(IDepend task : wf.getTaskList()){
				List<Integer> parents = null;
				
				try{
					parents = this.loader.getParent(task.getId());
				} catch (Exception ex){
					ex.printStackTrace();
				}	

				if(parents == null)
					continue;

				for(Integer id : parents)
					this.genEdge(wf.getTaskList().get(id), task);
			}

			wfs.add(wf);
		}
		
		Collections.sort(wfs, new Comparator<IAttribute>(){
			public int compare(IAttribute a1, IAttribute a2) {
				return ((Workflow) a1).getInterArrivalTime() 
					- ((Workflow) a2).getInterArrivalTime();
			}
		});
		
		return wfs;
	}

	protected void genEdge(IDepend parent, IDepend child){

		float max = (1 + this.va.getMaxComputationTime() - this.va.getMinComputationTime()) 
			* this.va.getCommunicationToComputationRatio();
		
		int cmTime = this.va.getMinComputationTime() + this.rd.nextInt((int) max);
		
		parent.getChildTaskLink().add(new TaskLink(
			cmTime,
			child
		));

		child.getParentTaskLink().add(new TaskLink(
			cmTime,
			parent
		));
	}
}
