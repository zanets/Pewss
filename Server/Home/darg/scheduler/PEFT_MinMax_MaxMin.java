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
import com.use.set.Table;

import com.use.ALauncher;
import com.use.queue.MixQueue;
import com.use.queue.QueueType;
import com.use.queue.event.Event;
import com.use.queue.event.EventType;
import com.use.resource.GapInfo;
import com.use.resource.IResNode;
import com.use.resource.SimpleNode;
import com.use.resource.platform.WorkflowPlatformHeterogeneous;
import com.use.workflow.Workflow;
import com.use.workflow.task.DAGDependTask;
import com.use.workflow.task.IAttribute;
import com.use.workflow.task.IDepend;
import com.use.workflow.task.TaskLink;

public class PEFT_MinMax_MaxMin extends PEFT_MaxMin_MaxMin {

  protected float compFirstOCT(int taskId, int srcId, List<IDepend> taskAttrList){
    IDepend targetTask = taskAttrList.stream().filter(attr -> attr.getId() == taskId).findFirst().get();
    List<TaskLink> childLink = targetTask.getChildTaskLink();
    List<Float> tmpList1 = new ArrayList<Float>();
    for(TaskLink clink : childLink){
      List<Float> tmpList2 = new ArrayList<Float>();
      for(IResNode srcAttr : srcAttrList){
        int thisSrcId = srcAttr.getId();
        int thistaskId = clink.getNextTask().getId();
        int cpTime = this.platform.getCPTime(thistaskId, thisSrcId);
        float commTime = (srcId == thisSrcId) ? 0 : clink.getWeight();
        float octV = (float) this.firstOCTTable.getElement(thistaskId, thisSrcId).orElseGet(()->{
            float oct = this.compFirstOCT(thistaskId, thisSrcId, taskAttrList);
            this.firstOCTTable.setElement(thistaskId, thisSrcId, oct);
            return oct;
        });
        tmpList2.add((float)octV+cpTime+commTime);
      }
      tmpList1.add(Collections.max(tmpList2));
    }
    return (tmpList1.size() == 0) ? 0 : Collections.min(tmpList1);
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
        int cpTime = this.platform.getCPTime(thistaskId, thisSrcId);
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

}
