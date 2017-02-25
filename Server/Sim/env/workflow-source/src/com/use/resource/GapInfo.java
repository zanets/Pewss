package com.use.resource;

public class GapInfo {
	private float bestValue;
	private int gapIndex;
	private long EST;
	private long gapStartTime;
	private long gapFinishTime;
	private int resId;
	
	public GapInfo (int gapIndex, long EST, long gapStartTime, long gapFinishTime){
		this.gapIndex = gapIndex;
		this.EST = EST;
		this.gapStartTime = gapStartTime;
		this.gapFinishTime = gapFinishTime;
	}
	
	public GapInfo(int gapIndex, long EST) {
		this(gapIndex, EST, 0, 0);
	}
	
	public float getBestValue() {
		return bestValue;
	}
	
	public void setBestValue(float bestValue) {
		this.bestValue = bestValue;
	}

	public int getGapIndex() {
		return gapIndex;
	}
	public long getEST() {
		return EST;
	}

	public long getGapStartTime() {
		return gapStartTime;
	}

	public long getGapFinishTime() {
		return gapFinishTime;
	}

	public int getResId() {
		return resId;
	}

	public void setResId(int resId) {
		this.resId = resId;
	}

	public void setGapIndex(int gapIndex) {
		this.gapIndex = gapIndex;
	}

	public void setEST(long eST) {
		EST = eST;
	}
	
}
