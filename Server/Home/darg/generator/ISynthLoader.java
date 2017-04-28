package darg.generator;
import java.util.List;

public interface ISynthLoader
{
	int cursor(int preCur);
	void open(String path) throws Exception;
	int getId();
	double getCpTime();
	List<Integer> getParent(int id) throws Exception;
}
