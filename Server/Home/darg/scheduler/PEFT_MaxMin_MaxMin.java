package darg.scheduler;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Comparator;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Stream;
import darg.set.Table;

import com.use.ALauncher;
import com.use.queue.MixQueue;
import com.use.queue.QueueType;
import com.use.queue.event.Event;
import com.use.queue.event.EventType;
import com.use.resource.GapInfo;
import com.use.resource.IResNode;
import com.use.resource.SimpleNode;
import com.use.workflow.Workflow;
import com.use.workflow.task.DAGDependTask;
import com.use.workflow.task.IAttribute;
import com.use.workflow.task.IDepend;
import com.use.workflow.task.TaskLink;
import com.use.resource.platform.WorkflowPlatform;
import com.use.scheduler.AListBaseWorkflowScheduler;

public class PEFT_MaxMin_MaxMin extends AListBaseWorkflowScheduler {
	protected List<IResNode> srcAttrList;
	protected Table firstOCTTable;
	protected Table secondOCTTable;
	protected Map<Integer, Float> rankOCT;
	protected Map<Integer, Boolean> isScheduled;
	public PEFT_MaxMin_MaxMin()
	{
		super();
	}

	@Override
	public void schedule() throws Exception {
		
		this.initialize();
	
		// this is for multiple workflow schedule
		for (IAttribute attr : this.workflowSet) {
			
			this.srcAttrList = this.platform.getResourcelist();
			Workflow workflow = (Workflow) attr;
			List<IDepend> taskAttrList = workflow.getTaskList();
			this.isScheduled = new HashMap<Integer, Boolean>();
			for(IDepend itask : taskAttrList)
			{
				this.isScheduled.put(itask.getId(), false);
			}
			
			// ==================
			// PEFT algorithm
			//

			this.genOCTTable(taskAttrList);
			this.genRankOCT(taskAttrList);

			List<IDepend> readyList = getReadyList(taskAttrList);
			// =================
			while(!readyList.isEmpty()){

				DAGDependTask task = this.getReadyTask(readyList);
				Map<IResNode, Float> oEftList = new HashMap<IResNode, Float>();

				// System.out.println("Get Task " + task.getId() + " from readylist");

				// computing oeft
				for(IResNode srcAttr : srcAttrList){
					float eft = (float) this.getEFT(task, srcAttr);
					float oct = (float) this.secondOCTTable.getElement(task.getId(), srcAttr.getId()).get();
					// System.out.println("task : "+ task.getId() +" eft : " + eft + " oct : "+oct + " total : " + (oct+eft));
					oEftList.put(srcAttr, eft + oct);
				}

				// get resource with minimum oeft
				Map.Entry<IResNode, Float> minOne = oEftList.entrySet().iterator().next();
				for (Map.Entry<IResNode, Float> entry : oEftList.entrySet())
					minOne = (minOne.getValue() > entry.getValue()) ? entry : minOne;

				// assign computation time and allocate to resource
				this.taskAllocation(minOne.getKey(), this.getBestGap(task, minOne.getKey()), task);
				this.isScheduled.put(task.getId(), true);
				
				// update readylist
				readyList = getReadyList(taskAttrList);
			}
			// ==================
		}
	}

	// =====================
	// function that computing rankOCT for peft alogrithm
	//
	protected void genRankOCT(List<IDepend> taskAttrList){
		this.rankOCT = new LinkedHashMap <Integer, Float>();
		Map<Integer, Float> unSorted  = new HashMap<Integer, Float>();
		for(IDepend taskAttr : taskAttrList){
			float totalOCT = 0;
			for(IResNode srcAttr : this.srcAttrList)
				totalOCT += (float) this.firstOCTTable.getElement(taskAttr.getId(), srcAttr.getId()).get();
			unSorted.put(taskAttr.getId(), totalOCT / this.srcAttrList.size());
		}
		Stream<Map.Entry<Integer, Float>> st = unSorted.entrySet().stream();
		st.sorted(Map.Entry.comparingByValue()).forEachOrdered(
				e -> this.rankOCT.put(e.getKey(), e.getValue())
		);
		// System.out.println(Arrays.toString(this.rankOCT.entrySet().toArray()));
	}

	protected List<Integer> getResIds()
	{
		List<Integer> res = new ArrayList<Integer>();
		for(IResNode srcAttr : this.platform.getResourcelist())
		{
			res.add(srcAttr.getId());
		}
		return res;
	}

	protected void genOCTTable(List<IDepend> taskAttrList){
		List<Integer> taskIdList = this.getTaskIdList(taskAttrList);
		List<Integer> srcIdList = this.getResIds();

		this.firstOCTTable = new Table(taskIdList, srcIdList);
		this.secondOCTTable = new Table(taskIdList, srcIdList);

		for(int taskId : taskIdList){
			for(int srcId : srcIdList){
				if(!this.firstOCTTable.getElement(taskId, srcId).isPresent())
					this.firstOCTTable.setElement(taskId, srcId, this.compFirstOCT(taskId, srcId, taskAttrList));
			}
		}

		for(int taskId : taskIdList){
			for(int srcId : srcIdList){
				if(!this.secondOCTTable.getElement(taskId, srcId).isPresent())
					this.secondOCTTable.setElement(taskId, srcId, this.compSecondOCT(taskId, srcId, taskAttrList));
			}
		}

	}

	protected float compFirstOCT(int taskId, int srcId, List<IDepend> taskAttrList){
		IDepend targetTask = taskAttrList.stream().filter(attr -> attr.getId() == taskId).findFirst().get();
		List<TaskLink> childLink = targetTask.getChildTaskLink();
		List<Float> tmpList1 = new ArrayList<Float>();
		for(TaskLink clink : childLink){
			List<Float> tmpList2 = new ArrayList<Float>();
			for(IResNode srcAttr : srcAttrList){
				int thisSrcId = srcAttr.getId();
				int thistaskId = clink.getNextTask().getId();
				int cpTime = ((DAGDependTask) clink.getNextTask()).getComputationTime();
				float commTime = (srcId == thisSrcId) ? 0 : clink.getWeight();
				float octV = (float) this.firstOCTTable.getElement(thistaskId, thisSrcId).orElseGet(()->{
						float oct = this.compFirstOCT(thistaskId, thisSrcId, taskAttrList);
						this.firstOCTTable.setElement(thistaskId, thisSrcId, oct);
						return oct;
				});
				tmpList2.add((float)octV+cpTime+commTime);
			}
			tmpList1.add(Collections.min(tmpList2));
		}
		return (tmpList1.size() == 0) ? 0 : Collections.max(tmpList1);
	}

	protected float compSecondOCT(int taskId, int srcId, List<IDepend> taskAttrList){
		IDepend targetTask = taskAttrList.stream().filter(attr -> attr.getId() == taskId).findFirst().get();
		List<TaskLink> childLink = targetTask.getChildTaskLink();
		List<Float> tmpList1 = new ArrayList<Float>();
		for(TaskLink clink : childLink){
			List<Float> tmpList2 = new ArrayList<Float>();
			for(IResNode srcAttr : srcAttrList){
				int thisSrcId = srcAttr.getId();
				int thistaskId = clink.getNextTask().getId();
				int cpTime = ((DAGDependTask) clink.getNextTask()).getComputationTime();
				float commTime = (srcId == thisSrcId) ? 0 : clink.getWeight();
				float octV = (float) this.secondOCTTable.getElement(thistaskId, thisSrcId).orElseGet(()->{
						float oct = this.compSecondOCT(thistaskId, thisSrcId, taskAttrList);
						this.secondOCTTable.setElement(thistaskId, thisSrcId, oct);
						return oct;
				});
				tmpList2.add((float)octV+cpTime+commTime);
			}
			tmpList1.add(Collections.min(tmpList2));
		}
		return (tmpList1.size() == 0) ? 0 : Collections.max(tmpList1);
	}

	protected List<IDepend> getReadyList(List<IDepend> taskAttrList){
		List<IDepend> readyList = new ArrayList<IDepend>();

		// scan all tasks
		for(IDepend taskAttr : taskAttrList){
			
			if(this.isScheduled.get(taskAttr.getId()))
			{
				continue;
			}

			boolean isReady = true;
			DAGDependTask task = (DAGDependTask) taskAttr;

			// scan all parent tasks
			for(TaskLink tl : task.getParentTaskLink())
			{
				boolean isScheduled = this.isScheduled.get(tl.getNextTask().getId());
				if(!isScheduled)
				{
					isReady = false;
					break;
				}
			}
			if(isReady)
				readyList.add(taskAttr);
		}
		/* replace with getReadyTask
		// sort readylist with rankoct
		Collections.sort(readyList, new Comparator<IDepend>() {
			public int compare(IDepend left, IDepend right) {
				return Float.compare(rankOCT.get(right.getId()), rankOCT.get(left.getId()));
			}
		});
		*/
		return readyList;
	}

	protected DAGDependTask getReadyTask(List<IDepend> readyList){
		float maxRankOCT = 0;
		IDepend maxRankOCTTask = readyList.get(0);
		for(IDepend itask : readyList){
			DAGDependTask task = (DAGDependTask) itask;
			float rankoct = this.rankOCT.get(task.getId());
			if(maxRankOCT < rankoct){
				maxRankOCT = rankoct;
				maxRankOCTTask = task;
			}
		}
		return (DAGDependTask) maxRankOCTTask;
	}

	protected float getEFT(IDepend taskAttr, IResNode srcAttr){
		GapInfo bestGap = this.getBestGap(taskAttr, srcAttr);
		return bestGap.getEST() + ((DAGDependTask) taskAttr).getComputationTime();
	}

	protected List<Integer> getTaskIdList(List<IDepend> taskAttrList){
		List<Integer> taskIdList = new ArrayList<Integer>();
		taskAttrList.forEach(attr ->
			taskIdList.add(attr.getId())
		);
		return taskIdList;
	}

}