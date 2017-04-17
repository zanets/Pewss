package darg.platform;

import java.util.List;
import com.use.workflow.task.IDepend;
import com.use.workflow.task.DAGDependTask;
import com.use.resource.SimpleNode;
import darg.set.Table;
public class WorkflowPlatformHeterogeneous extends WorkflowPlatform 
{

	public WorkflowPlatformHeterogeneous()
	{
		super();
	}
	
	public void genCPTimes(List<Integer> taskIdList, List<IDepend> taskAttrList)
	{
		this.cpTimes = new Table(taskIdList, this.getResIds());
		this.cpRates = new Table(taskIdList, this.getResIds());

		for(IDepend taskAttr : taskAttrList)
		{
			DAGDependTask task = (DAGDependTask) taskAttr;

			this.getResourcelist().forEach( srcAttr -> {
					SimpleNode res = (SimpleNode) srcAttr;
					float cpRate = ( this.rander.nextInt(10) + 10 ) / 10;
					float cpTime = task.getComputationTime() * cpRate;
					
					this.cpRates.setElement(task.getId(), res.getId(), (float) cpRate);
					this.cpTimes.setElement(task.getId(), res.getId(), (int) cpTime);
				}
			);
		}
	}
}

