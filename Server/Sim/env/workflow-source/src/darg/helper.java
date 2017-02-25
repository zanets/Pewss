package darg;

import com.use.workflow.Workflow;
import com.google.gson.*;
import com.use.workflow.task.DAGDependTask;
import com.use.workflow.task.IDepend;
import com.use.workflow.task.TaskLink;

import java.util.ArrayList;
import java.util.List;


class task_link{
    public int task_id;
    public int weight;

    task_link(int id, int weight){
        this.task_id = id;
        this.weight = weight;
    }
}

class workflow_task_pack{
    public int order_number;
    public double computation_time;
    public List<task_link>parent;
    public List<task_link>children;
    public int resource_id;
    public long start_time;
    public long finish_time;
    public int level;
    {
        parent = new ArrayList<task_link>();
        children = new ArrayList<task_link>();
        level = 0;
    }
}

class workflow_pack{
    public int id;
    public int number_of_task;
    public int inter_arrivel_time;
    public List<Integer> critical_path;
    public List<workflow_task_pack> task_list;
    {
        critical_path = new ArrayList<Integer>();
        task_list = new ArrayList<workflow_task_pack>();
    }
}


public class helper {
    /*
    * return json format string for web
    * */
    public static String workflow_to_json(Workflow wk) {
        /* note : Gson cannot deserialize inner class, it will return null */
        workflow_pack _wk = new workflow_pack();
        _wk.id = wk.getId();
        _wk.inter_arrivel_time = wk.getInterArrivalTime();
        _wk.number_of_task = wk.getTaskList().size();
        /*for(IDepend itask : wk.getCriticalPathTasksList()){
            DAGDependTask task = (DAGDependTask) itask;
            _wk.critical_path.add(task.getId());
        }*/
        for (IDepend itask : wk.getTaskList()) {
            DAGDependTask task = (DAGDependTask) itask;
            workflow_task_pack task_pack = new workflow_task_pack();

            task_pack.computation_time = task.getComputationTime();
            task_pack.order_number = task.getId();
            task_pack.resource_id  = task.getResourceId();
            task_pack.finish_time = task.getTrueFinishTime();
            task_pack.start_time = task.getTrueStartTime();
        
            for (TaskLink link : task.getParentTaskLink())
                task_pack.parent.add(new task_link(link.getNextTask().getId(), link.getWeight()));

            for (TaskLink link : task.getChildTaskLink()) {
                task_pack.children.add(new task_link(link.getNextTask().getId(), link.getWeight()));
            }
            _wk.task_list.add(task_pack);
        }
        /* couting level*/
        for (workflow_task_pack task : _wk.task_list) {
            for (task_link link : task.children) {
                for (int i = 0; i < _wk.task_list.size(); i++) {
                    if (_wk.task_list.get(i).level < task.level + 1 && _wk.task_list.get(i).order_number == link.task_id) {
                        _wk.task_list.get(i).level = task.level + 1;
                    }
                }
            }
        }
        return new Gson().toJson(_wk, workflow_pack.class);
    }

}
