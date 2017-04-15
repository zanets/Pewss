package darg.utils;

import java.io.IOException;
import java.io.Writer;
import java.io.FileWriter;
public class CSVWriter {
	
	private String fpath = null;
	private FileWriter writer = null;

	public CSVWriter(String fpath){
		this.fpath = fpath;
	}

	public void open() throws IOException{
		if(!this.isReady())
			this.writer = new FileWriter(this.fpath);				
	}

	public void writeLine(String line) throws IOException{
		if(!this.isReady())	
			throw new IOException("File not opened");

		this.writer.write(line + "\n");
	}

	public void close() throws IOException{
		if(!this.isReady())
			throw new IOException("File not opened");
		this.writer.close();
		this.writer = null;
	}

	public boolean isReady(){
		return this.writer != null;
	}


}
