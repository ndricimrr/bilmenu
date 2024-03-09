package com.bilmenu;

import android.app.Activity;
import android.os.Bundle;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

public class WebActivity extends AppCompatActivity {

    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_web);

        // Get the URL from the Intent
        String url = getIntent().getStringExtra("URL");

        // Initialize WebView
        webView = findViewById(R.id.webView);
        webView.setWebViewClient(new WebViewClient()); // Open URLs in WebView, not in browser
        webView.getSettings().setJavaScriptEnabled(true); // Enable JavaScript (optional)


        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                // Handle the error here (e.g., display an error message)
                Toast.makeText(WebActivity.this, "Error loading webpage", Toast.LENGTH_SHORT).show();
            }
        });

        // Load the specified URL
        webView.loadUrl(url);
    }
}