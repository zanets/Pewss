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
import darg.platform.WorkflowPlatform;

/*
* PEFT alg with Top Rank.
* All enhanced version used 
* Top Rank should herit this
* class
*/
public class PEFT_Top_MaxMin_MaxMin extends PEFT_MaxMin_MaxMin {

  protected Map<Integer, Float> topRank;
  
  @Override
  public void schedule() throws Exception {
    
    super.schedule();
    this.srcAttrList = this.platform.getResourcelist();
    
    // this is for multiple workflow schedule
    for (IAttribute attr : workflowSet) {
      resetActionQ();
      Workflow workflow = (Workflow) attr;
      List<IDepend> taskAttrList = workflow.getTaskList();
       
      isPreScheduled = new boolean[taskAttrList.size()];
      
      // ==================
      // PEFT algorithm
      //
      platform.genCPTimes(taskAttrList);
      this.topRank = new HashMap<Integer, Float>();
      this.topRank.put(0, 0.0f);
      this.genOCTTable(taskAttrList);
      this.genRankOCT(taskAttrList);
      
      List<IDepend> readyList = getReadyList(taskAttrList);
      // =================
      while(!readyList.isEmpty()){
        
        DAGDependTask task = this.getReadyTask(readyList);
        Map<IResNode, Float> oEftList = new HashMap<IResNode, Float>();

        // System.out.println("Get Task " + task.getId() + " from readylist");
        // System.out.println(this.topRank);  
        // computing oeft
        for(IResNode srcAttr : srcAttrList){
          float eft = (float) this.getEFT(task, srcAttr);
          float oct = (float) this.secondOCTTable.getElement(task.getId(), srcAttr.getId()).get();
          // System.out.println("task : "+ task.getId() +" eft : " + eft + " oct : "+oct + " total : " + (oct+eft));
          oEftList.put(srcAttr, eft + oct);
        }

        // get resource with minimum oeft
        Map.Entry<IResNode, Float> minOne = oEftList.entrySet().iterator().next();
        for (Map.Entry<IResNode, Float> entry : oEftList.entrySet()){
          minOne = (minOne.getValue() > entry.getValue()) ? entry : minOne;
        }

        // assign computation time and allocate to resource
        task.setComputationTime(this.platform.getCPTime(task.getId(), minOne.getKey().getId()));
        this.taskAllocation(minOne.getKey(), this.getBestGap(task, minOne.getKey()), task);       
        isPreScheduled[task.getId()] = true;
        float newTopRank = this.getTopRank(task);
        this.topRank.put(task.getId(), newTopRank);

        // update readylist
        readyList = getReadyList(taskAttrList);
      }
      // ==================
    }
  }

  protected DAGDependTask getReadyTask(List<IDepend> readyList){
    float maxTopRankplusRankOCT = 0;
    IDepend maxTopRankplusRankOCTTask = readyList.get(0);
    for(IDepend itask : readyList){
      DAGDependTask task = (DAGDependTask) itask;
      float rankoct = this.rankOCT.get(task.getId());
      float TopRank = this.getTopRank(task);
      float TopRank2 = task.getTopRank();
      float total = rankoct + TopRank;
      if(maxTopRankplusRankOCT < total){
        maxTopRankplusRankOCT = total;
        maxTopRankplusRankOCTTask = task;
      }
    }
    return (DAGDependTask) maxTopRankplusRankOCTTask;
  }

  protected float getTopRank(DAGDependTask task){
    float TopRank = 0;
    for(TaskLink link : task.getParentTaskLink()){
      DAGDependTask linkTask = ( DAGDependTask ) link.getNextTask(); 
      float linkTopRank = this.topRank.get(linkTask.getId());
      linkTopRank += linkTask.getComputationTime();
      linkTopRank += (linkTask.getResourceId() == task.getResourceId()) ? 0 : link.getWeight();
      TopRank = (TopRank < linkTopRank) ? linkTopRank : TopRank;
    }
    // System.out.println("task : " + task.getId() + "top : " + TopRank);
    return TopRank;
  }
}
