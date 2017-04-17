package darg.utils;

import java.util.List;
import java.util.ArrayList;

public class CSVFetcher extends Fetcher{
	
	private static CSVFetcher instance = null;
	private List<Object> fields= new ArrayList<Object>();
	private CSVFetcher(){}

	public static CSVFetcher getInstance(){
		if(instance == null)
			instance = new CSVFetcher();
		return instance;
	}

	public void print(){
		for(int i=0; i<this.fields.size(); i++){
			System.out.print(this.fields.get((i)));
			if(i != this.fields.size()-1)
				System.out.print(',');
		}
		System.out.println();
	}

	public void clear(){
		this.fields.clear();
	}

	public void fetch(Object obj){
		this.fields.add(obj);	
	}

}
