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
	
	private Random rd = new Random();
	private XMLoader loader = new WFXMLoader();
	private DAGVariable va = null;

	public MontageGenerator() {
		super();
		this.va = DAGVariable.getInstance();
	}
	
	public List<IAttribute> generate() throws Exception{

		try
			this.loader.open('abc.xml');
		catch (Exception ex)
			ex.printStackTrace();

		List<IAttribute> wfs = new ArrayList<IAttribute>();
		
		for(int wfid=0; wfid<this.va.getNumberOfWorkflow(); wfid++){
			Workflow wf = new Workflow(wfid);
			
			wf.setInterArrivalTime(
				this.rd.nextInt(this.va.getMaxInterArrivalTime())
			);
			
			// create workflow task
			// TODO: random computation and communication cost
			IDepend task = new DAGDependTask(
				new DependTaskInfo(i+1, wf)
			);
			
			wfs.add(wf);
		}
		
		Collections.sort(wfs, new Comparator<IAttribute>(){
			public int compare(IAttribute a1, IAttribute a2) {
				return a1.getInterArrivalTime() - a2.getInterArrivalTime();
			}
		});

		return wfs;
	}

	public IDepend genTask(int id, ){

	}

	
}
