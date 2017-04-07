JC=javac
J=java
DEST=./
all: testMontageGenerator

test: 
	${J} -cp ./ darg.generator.testMontageGenerator

testMontageGenerator: ISynthLoader.class XMLoader.class SynthLoader.class
	${JC} -d ${DEST} $@.java

%.class:
	${JC} -d ${DEST} $*.java
