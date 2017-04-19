package darg.platform;

import com.use.config.DAGVariable;
import com.use.resource.IResNode;
import com.use.resource.SimpleNode;
import com.use.resource.info.ResInfo;
import com.use.workflow.task.DAGDependTask;
import com.use.workflow.task.IDepend;
import com.use.resource.platform.APlatform;
import com.use.resource.platform.IPlatform;
import darg.set.Table;
import java.util.List;
import java.util.ArrayList;
import java.util.Random;

public abstract class WorkflowPlatform extends APlatform implements IPlatform 
{

	protected Table cpTimes = null;
	protected Table cpRates = null;
	protected int resSize = 0;
	protected DAGVariable DAGConfig = null;
	protected Random rander = null;
	
	public WorkflowPlatform()
	{
		this.DAGConfig = DAGVariable.getInstance();
		this.resSize = this.DAGConfig.getNumberOfResource();
		this.rander = new Random(this.DAGConfig.getRandomSeed());
	}
	
	public void alloc() throws Exception 
	{
		this.getResourcelist().clear();
		for(int i = 0; i < this.resSize; i++) 
		{
			ResInfo info = new ResInfo(i);
			info.setSpeed(1); // useless, ignore it
			SimpleNode res = new SimpleNode(info);
			this.add(res);
		}
	}

	public abstract void genCPTimes(List<IDepend> taskAttrList);

	public int getCPTime(int taskId, int resId)
	{
		return (int) this.cpTimes.getElement(taskId, resId).get();
	}

	public List<Integer> getResIds()
	{
		List<Integer> ids = new ArrayList<Integer>();
		this.getResourcelist().forEach( attr -> {
				ids.add(attr.getId());
			}
		);
		return ids;
	}

	protected float getResCPRate(int taskId, int resId)
	{
		return (float) this.cpRates.getElement(taskId, resId).get();
	}

	protected List<Integer> getTaskIdList(List<IDepend> taskAttrList){
		List<Integer> taskIdList = new ArrayList<Integer>();
		taskAttrList.forEach(attr -> 
			taskIdList.add(attr.getId())
		);
		return taskIdList;
	}

	public void clonePlatform(WorkflowPlatform cloneBase)
	{

		try {
			alloc();
		} catch (Exception e) {
			System.err.println("clone alloc fail");
		}

		for(int i = 0; i < this.resSize; i++) 
		{
			SimpleNode clone = (SimpleNode) list.get(i);
			SimpleNode baseResource = cloneBase.getResource(i);
			clone.getAllocationQueue().addAll(baseResource.getAllocationQueue());
			clone.getOrderQueue().addAll(baseResource.getOrderQueue());
		}
	}
}

