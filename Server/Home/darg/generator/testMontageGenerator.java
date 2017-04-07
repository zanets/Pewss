package darg.generator;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.Collections;  
import java.util.Comparator; 


public class testMontageGenerator{
	public static void main(String[] argv){
		List<obj> objs = new ArrayList<obj>();
		ISynthLoader loader = new SynthLoader();

		try{
			loader.open("SyntheticWorkflows/MONTAGE/MONTAGE.n.100.0.dax");
		}catch (Exception ex){
			ex.printStackTrace();
		}
		
		int cur = 0;
		while((cur = loader.cursor(cur)) > 0)
			objs.add(new obj(loader.getId()));

		
		for(obj o : objs){
			try{
				List<Integer> ppps = loader.getParent(o.id);
				for(Integer i : ppps){
					if(i == objs.get(i).id)
						System.out.println("pass");
				}		
			}catch(Exception ex){
				ex.printStackTrace();
			}
		}
	}
}


class obj{
	public obj(int id){
		this.id = id;
	}
	public int id;
}
