package br.gov.serpro.gamelivre;

import android.os.Bundle;
import org.apache.cordova.DroidGap;

public class FislActivity extends DroidGap {
 
    @Override
    public void onCreate(Bundle savedInstanceState) {
    	
       super.onCreate(savedInstanceState);
       
       super.loadUrl("file:///android_asset/www/index.html");
    }
}

