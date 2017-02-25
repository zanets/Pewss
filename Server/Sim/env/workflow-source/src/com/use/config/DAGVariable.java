package com.use.config;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.util.Scanner;
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
import com.use.utils.USESUtils;
import com.use.workflow.grouping.IGrouping;
import com.use.workflow.ranking.IRanking;

public class DAGVariable implements IVariable {

	private static DAGVariable instance;
	private int numberOfWorkflow;
	private int randomSeed;
	private float communicationToComputationRatio;
	private int minComputationTime;
	private int maxComputationTime;
	private int maxInterArrivalTime;
	private int numberOfForkJoin;
	private int numberOfBranch;
	private int nodesForEachBranch;
	private int numberOfResource;
	private int numberOfExperiments;
	private int numberOfLevel;
	private int numberOfNodesPerLevel;
	private float fitnessWeight;
	private float EFTWeight;
	private float remainingTimeWeight;
	private List<Integer> visualization;
	private String rankingMethod;
	private String groupingMethod;
	private IRanking ranking;
	private IGrouping grouping;
	
	
	public DAGVariable() throws Exception {
		instance = this;
		this.numberOfWorkflow = 1;
		this.randomSeed = 1;
		this.communicationToComputationRatio = 1;
		this.minComputationTime = 1;
		this.maxComputationTime = 30;
		this.maxInterArrivalTime = 30;
		this.numberOfForkJoin = 1;
		this.numberOfBranch = 2;
		this.nodesForEachBranch = 3;
		this.numberOfResource = 4;
		this.numberOfExperiments=1;
		this.EFTWeight = 1;
		this.numberOfLevel = 5;
		this.numberOfNodesPerLevel = 5;
		this.rankingMethod = "BottomAmountRank";
		this.groupingMethod = "NewPCHGrouping";
		this.visualization = new ArrayList<Integer>();
		readConfig();
		if (ranking == null) {
			ranking = Class.forName("com.use.workflow.ranking." + rankingMethod).asSubclass(IRanking.class).newInstance();
		}
		if (grouping == null) {
			grouping = Class.forName("com.use.workflow.grouping." + groupingMethod).asSubclass(IGrouping.class).newInstance();
		}
		
	}
	
	@Override
	public void readConfig() throws FileNotFoundException {

		Scanner in = new Scanner(System.in);
		String delimiter = "=";
		while (in.hasNext()) {
			String str = in.next();
			String value = str.split(delimiter)[1];
			if (str.startsWith("randomSeed")) {
				this.randomSeed = Integer.parseInt(value);
			}
			else if (str.startsWith("communicationToComputationRatio")) {
				this.communicationToComputationRatio = Float.parseFloat(value);
			}
			else if (str.startsWith("minComputationTime")) {
				this.minComputationTime = Integer.parseInt(value);
			}
			else if (str.startsWith("maxComputationTime")) {
				this.maxComputationTime = Integer.parseInt(value);
			}
			else if (str.startsWith("maxInterArrivalTime")) {
				this.maxInterArrivalTime = Integer.parseInt(value);
			}
			else if (str.startsWith("numberOfForkJoin")) {
				this.numberOfForkJoin = Integer.parseInt(value);
			}
			else if (str.startsWith("numberOfBranch")) {
				this.numberOfBranch = Integer.parseInt(value);
			}
			else if (str.startsWith("nodesForEachBranch")) {
				this.nodesForEachBranch = Integer.parseInt(value);
			}
			else if (str.startsWith("numberOfWorkflow")) {
				this.numberOfWorkflow = Integer.parseInt(value);
			}
			else if (str.startsWith("numberOfResource")) {
				this.numberOfResource = Integer.parseInt(value);
			}
			else if (str.startsWith("numberOfExperiments")) {
				this.numberOfExperiments = Integer.parseInt(value);
			}
			else if (str.startsWith("rankingMethod")) {
				this.rankingMethod = value;
			}
			else if (str.startsWith("groupingMethod")) {
				this.groupingMethod = value;
			}
			else if (str.startsWith("fitnessWeight")) {
				this.fitnessWeight = Float.parseFloat(value);
			}
			else if (str.startsWith("EFTWeight")) {
				this.EFTWeight = Float.parseFloat(value);
			}
			else if (str.startsWith("remainingTimeWeight")) {
				this.remainingTimeWeight = Float.parseFloat(value);
			}
			else if (str.startsWith("numberOfLevel")) {
				this.numberOfLevel = Integer.parseInt(value);
			}
			else if (str.startsWith("numberOfNodesPerLevel")) {
				this.numberOfNodesPerLevel = Integer.parseInt(value);
			}
			else if (str.startsWith("visualization")) {
				String[] visuals = value.split(",");
				this.visualization.clear();
				for(String visual : visuals){
					if(visual.equals(""))
						continue;
					this.visualization.add(Integer.parseInt(visual));
				}
			}
			
		}
	}

	public static DAGVariable getInstance() {
		return instance;
	}

	public int getRandomSeed() {
		return randomSeed;
	}

	public int getMinComputationTime() {
		return minComputationTime;
	}

	public int getMaxComputationTime() {
		return maxComputationTime;
	}

	public int getMaxInterArrivalTime() {
		return maxInterArrivalTime;
	}

	public int getNumberOfForkJoin() {
		return numberOfForkJoin;
	}

	public int getNumberOfBranch() {
		return numberOfBranch;
	}

	public int getNodesForEachBranch() {
		return nodesForEachBranch;
	}
	
	public int getNumberOfWorkflow() {
		return numberOfWorkflow;
	}
	
	public float getCommunicationToComputationRatio() {
		return communicationToComputationRatio;
	}

	public int getNumberOfResource() {
		return numberOfResource;
	}

	public int getNumberOfExperiments() {
		return numberOfExperiments;
	}

	public int getNumberOfLevel() {
		return numberOfLevel;
	}

	public int getNumberOfNodesPerLevel() {
		return numberOfNodesPerLevel;
	}

	public float getFitnessWeight() {
		return fitnessWeight;
	}

	public float getEFTWeight() {
		return EFTWeight;
	}

	public float getRemainingTime() {
		return remainingTimeWeight;
	}

	public IRanking getRanking() {
		return ranking;
	}

	public IGrouping getGrouping() {
		return grouping;
	}

	public List<Integer> getVisualization() {
		return this.visualization;
	}
	
}
