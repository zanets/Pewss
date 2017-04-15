package darg.set;

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

public class Table{
	protected List<Object> colSet;
	protected List<Object> rowSet;
	protected Map<Object, Map<Object, Object>> content = new HashMap<Object, Map<Object, Object>>();
	
	@SuppressWarnings("unchecked")
	public Table(List<? extends Object> rowList, List<? extends Object> colList){
		this.colSet = (List<Object>) colList;
		this.rowSet = (List<Object>) rowList;
		for(Object i : rowList){
			Map<Object, Object> col = new HashMap<Object, Object>();
			colList.forEach((j)->col.put(j, null));
			this.content.put(i, col);
		}
	}

	public void setElement(Object rowKey, Object colKey, Object ele){
		this.content.get(rowKey).put(colKey, ele);
	}
	
	public Optional<Object> getElement(Object rowKey, Object colKey){
		Object ele = this.content.get(rowKey).get(colKey);
		return (ele == null) ? Optional.empty() : Optional.of(ele);
	}
	
	public void print(){
		System.out.println();
		this.colSet.forEach((col)->System.out.print("\t"+col));
		System.out.println();
		for(Object i : this.rowSet){
			System.out.print(i+"\t");
			this.colSet.forEach((j)->System.out.print(this.getElement(i, j).orElse("NoValue")+"\t"));
			System.out.println();
		}
		System.out.println();
	}
	public List<Optional<Object>> getElements(Object rowKey){
		List<Optional<Object>> elements = new ArrayList<Optional<Object>>();
		for(Object colKey : this.colSet)
			elements.add(this.getElement(rowKey, colKey));
		return elements;
	}

}
