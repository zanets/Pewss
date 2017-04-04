package darg.generator;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.Collections;  
import java.util.Comparator; 


public class testMontageGenerator{
	public static void main(String[] argv){

		WFXMLoader loader = new WFXMLoader();
		try{
			loader.open("SyntheticWorkflows/MONTAGE/MONTAGE.n.100.0.dax");
		}catch (Exception ex){
			ex.printStackTrace();
		}

		int cursor = 1;
		while((cursor = loader.Cursor(cursor)) > 0){
			System.out.println(loader.getCpTime());
			System.out.println(loader.getId());
		}



	}
}
