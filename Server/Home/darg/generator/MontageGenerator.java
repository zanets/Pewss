package darg.generator;

import java.lang.Integer;
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
	
	private Random rd = new Random();
	private XMLoader loader = new WFXMLoader();
	private DAGVariable va = null;

	public MontageGenerator() {
		super();

		this.va = DAGVariable.getInstance();
	}
	
	public List<IAttribute> generate() throws Exception{

		try {
			this.loader.open("SyntheticWorkflows/MONTAGE/MONTAGE.n.100.0.dax");
		} catch (Exception ex){
			ex.printStackTrace();
			return null;
		}

		List<IAttribute> wfs = new ArrayList<IAttribute>();
		
		// TODO: the for-loop use same xml input
		// consider loading different xml file by 
		// differnt task amount from DAGVariable. 
		for(int wfid=0; wfid<this.va.getNumberOfWorkflow(); wfid++){

			// create workflow
			Workflow wf = new Workflow(wfid);

			wf.setInterArrivalTime(
				this.rd.nextInt(this.va.getMaxInterArrivalTime())
			);
			
			// create tasks
			int cur = 0;
			while((cur= this.loader.Cursor(cur)) > 0){
				DAGDependTask task = new DAGDependTask(
					new DependTaskInfo(
						this.loader.getId(),
						this.loader.getCpTime()
					)
				);
				task.setBelongWorkflow(wf);
				wf.getTaskList().add(task);
			}

			// create edge
			for(DAGDependTask task : wf.getTaskList()){
								
			}

		}
		
		Collections.sort(wfs, new Comparator<IAttribute>(){
			public int compare(IAttribute a1, IAttribute a2) {
				return a1.getInterArrivalTime() - a2.getInterArrivalTime();
			}
		});

		return wfs;
	}

	protected void genEdge(IDepend parent, IDepend child){

	}
}
