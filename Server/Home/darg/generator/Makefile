JC=javac
J=java
DEST=./
all: testMontageGenerator

test: 
	${J} -cp ./ darg.generator.testMontageGenerator

testMontageGenerator: IWFXMLoader.class XMLoader.class WFXMLoader.class
	${JC} -d ${DEST} $@.java

%.class:
	${JC} -d ${DEST} $*.java
