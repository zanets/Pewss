package com.use.resource.platform;

import com.use.config.DAGVariable;
import com.use.resource.IResNode;
import com.use.resource.SimpleNode;
import com.use.resource.info.ResInfo;
import com.use.workflow.task.DAGDependTask;
import com.use.workflow.task.IDepend;
import com.use.set.Table;
import java.util.List;
import java.util.ArrayList;
public class WorkflowPlatformHeterogeneous extends APlatform implements IPlatform {
		public Table cpTimeTable;
		protected int numberOfResource;
		public double[] speedList = new double[]{
				1.4,
				1.2,
				1.3,
				1.2,
				1.1,
				1.3,
				1.3,
				1.2,
				1.1,
				1.2,
				1.2,
				1.1,
				1.3,
				1.1,
				1.2
			};
	
	@Override
	public void alloc() throws Exception {
	this.getResourcelist().clear();
	numberOfResource = DAGVariable.getInstance().getNumberOfResource();
	for(int i = 0;i<numberOfResource;i++) {
		ResInfo info = new ResInfo(i);
		info.setSpeed((float) this.getSpeed(i));
		SimpleNode resource = new SimpleNode(info);
		add(resource);
	}
	}
	

	
	public void printTimeLine() {
		for(IResNode tmp:list) {
			System.out.print("Resource#"+tmp.getId()+":");
			SimpleNode resource = (SimpleNode)tmp;
			for(IDepend tmp2:resource.getAllocationQueue()) {
				DAGDependTask task = (DAGDependTask)tmp2;
				System.out.print(task.getTrueStartTime()+" "+task.getTrueFinishTime()+" ");
			}
			System.out.println();
		}
	}
	public void printTimeLineEFT() {
		for(IResNode tmp:list) {
			System.out.print("Resource#"+tmp.getId()+":");
			SimpleNode resource = (SimpleNode)tmp;
			for(IDepend tmp2:resource.getAllocationQueue()) {
				DAGDependTask task = (DAGDependTask)tmp2;
				System.out.print(task.getEST()+" "+task.getEFT()+" ");
			}
			System.out.println();
		}
	}

public double getSpeed(int i) {
	return this.speedList[i];
}

      public double[] getSpeedList() {
  return this.speedList;
}

	public void genCPTimeTable(List<Integer> taskIdList, List<IDepend> taskAttrList){
		this.cpTimeTable = new Table(taskIdList, this.getSrcIdList());
		for(IDepend taskAttr : taskAttrList){
			DAGDependTask task = (DAGDependTask)taskAttr;
			this.getResourcelist().forEach(srcAttr->{
				SimpleNode src = (SimpleNode)srcAttr;
				float cpTime = task.getComputationTime() * src.getSpeed();
				this.cpTimeTable.setElement(task.getId(), src.getId(), (int)cpTime);
			});
		}
		//this.cpTimeTable.print();
	}

	public int getCPTime(int taskid, int cpuid){
		int cpTime = (int)this.cpTimeTable.getElement(taskid, cpuid).get();
		return cpTime;
	}

	public List<Integer> getSrcIdList(){
		List<Integer> srcIdList = new ArrayList<Integer>();
		this.getResourcelist().forEach((attr)->srcIdList.add(attr.getId()));
		return srcIdList;
	}

	public void clonePlatform(WorkflowPlatformHeterogeneous cloneBase){
		this.speedList = cloneBase.getSpeedList();
		try {
			alloc();
		} catch (Exception e) {
			System.err.println("clone alloc fail");
		}
		for(int i=0;i<numberOfResource;i++) {
			SimpleNode clone = (SimpleNode)list.get(i);
			SimpleNode baseResource = cloneBase.getResource(i);
			clone.getAllocationQueue().addAll(baseResource.getAllocationQueue());
			clone.getOrderQueue().addAll(baseResource.getOrderQueue());
		}
	}
	
	
}

