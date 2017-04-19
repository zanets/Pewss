package com.use.scheduler;

import com.use.resource.GapInfo;
import com.use.workflow.task.DAGDependTask;
import com.use.workflow.task.IAttribute;

public class HEFTwithBestFit extends HEFT {
	@Override
	protected GapInfo compareGap(GapInfo bestGapInfo,GapInfo gapInfo, IAttribute task) {
		if(bestGapInfo==null)
			return gapInfo;
		boolean isBestGapInfoFinal=false;
		boolean isGapInfoFinal = false;
		if(bestGapInfo.getGapFinishTime()==0&&bestGapInfo.getGapStartTime()==0)
			isBestGapInfoFinal = true;
		if(gapInfo.getGapFinishTime()==0&&gapInfo.getGapStartTime()==0)
			isGapInfoFinal = true;
		
		if(isBestGapInfoFinal&&isGapInfoFinal) {
			if(bestGapInfo.getEST()<gapInfo.getEST())
				return bestGapInfo;
			else
				return gapInfo;
		}
		else if(isBestGapInfoFinal&&!isGapInfoFinal) {
			gapInfo.setBestValue( gapInfo.getGapFinishTime() - gapInfo.getGapStartTime() - ((DAGDependTask) task).getComputationTime() );
			return gapInfo;
		}
		else if(!isBestGapInfoFinal&&isGapInfoFinal) {
			bestGapInfo.setBestValue( bestGapInfo.getGapFinishTime() - bestGapInfo.getGapStartTime() - ((DAGDependTask) task).getComputationTime() );
			return bestGapInfo;
		}
		else {
			gapInfo.setBestValue( gapInfo.getGapFinishTime() - gapInfo.getGapStartTime() - ((DAGDependTask) task).getComputationTime() );
			bestGapInfo.setBestValue( bestGapInfo.getGapFinishTime() - bestGapInfo.getGapStartTime() - ((DAGDependTask) task).getComputationTime() );
			if(gapInfo.getBestValue() < bestGapInfo.getBestValue())
				return gapInfo;
			else
				return bestGapInfo;
		}
	}
}
