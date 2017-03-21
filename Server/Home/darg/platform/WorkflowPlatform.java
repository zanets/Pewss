package darg.platform;

import com.use.resource.platform.APlatform;
import com.use.resource.platform.IPlatform;
import com.use.config.DAGVariable;
import com.use.resource.IResNode;
import com.use.resource.SimpleNode;
import com.use.resource.info.ResInfo;
import com.use.workflow.task.DAGDependTask;
import com.use.workflow.task.IDepend;

public class WorkflowPlatform extends WorkflowPlatformHeterogeneous {

	public WorkflowPlatform(){
		this.speedList = new double[]{
			1,
			1,
			1,
			1,
			1,
			1,
			1,
			1,
			1,
			1,
			1,
			1,
			1,
			1,
			1
		};
	}
	
}
