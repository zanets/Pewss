package darg.platform;

import java.util.List;
import com.use.workflow.task.IDepend;
import com.use.workflow.task.DAGDependTask;
import com.use.resource.SimpleNode;
import darg.set.Table;
public class WorkflowPlatformHomogeneous extends WorkflowPlatform 
{

	public WorkflowPlatformHomogeneous()
	{
		super();
	}
	
	public void genCPTimes(List<IDepend> taskAttrList)
	{
		List<Integer> taskIdList = this.getTaskIdList(taskAttrList);
		this.cpTimes = new Table(taskIdList, this.getResIds());
		this.cpRates = new Table(taskIdList, this.getResIds());

		for(IDepend taskAttr : taskAttrList)
		{
			DAGDependTask task = (DAGDependTask) taskAttr;

			this.getResourcelist().forEach( srcAttr -> {
					SimpleNode res = (SimpleNode) srcAttr;
					float cpRate = 1;
					float cpTime = task.getComputationTime();
					
					this.cpRates.setElement(task.getId(), res.getId(), (float) cpRate);
					this.cpTimes.setElement(task.getId(), res.getId(), (int) cpTime);
				}
			);
		}
	}
}

