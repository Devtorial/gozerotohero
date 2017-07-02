<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
};
</script>

<style>
    a {
      cursor: pointer;
    }
    h1 {
      font-size: 14pt;
      margin-top: 10px;
    }
    form {
      display: inline-block;
    }
    ul {
      list-style-type: none;
      padding: 0;
    }
    .fa {
      font-size: 12pt;
    }
    .page {
      margin: 60px auto 0 auto;
      width: 988px;
    }
    #leftnav {
      width: 180px;
      position: fixed;
      padding-top: 10px;
    }
    #leftnav li {
      color: #666;
      cursor: pointer;
      padding: 4px 6px;
    }
    #leftnav li:hover {
      background-color: #ddd;
    }
    #leftnav .icon {
      width: 22px;
      display: inline-block;
    }
    .header {
      text-transform: uppercase;
    }
    #maincontent {
      width: 500px;
      float: left;
      margin-left: 190px;
    }
    #rightnav {
      width: 308px;
      position: fixed;
      margin-left: 700px;
    }
    .list-group-item {
      margin-top: 10px;
      padding: 0;
      position: relative; 
      display: block;
      margin-bottom: -1px;
      border: 1px solid #ddd;
    }
    .miniprofile {
      width: 24px;
    }
    .avatar {
      float: left;
      width: 40px;
      margin-right: 10px;
    }
    .date > a {
      color: #999;
    }
    .date {
      font-size: 12px;
    }
    .post {
      padding: 10px 15px;
    }
    .react {
      width: 100%;
      border-top: 1px solid #ddd;
      margin-top: 10px;
    }
    .react > span {
      display: inline-block;
      margin-top: 10px;
      margin-right: 20px;
    }

    .message {
      clear: both;
      margin-top: 5px;
      font-size: 15px;
    }
    .image, .video {
      margin-top: 10px;
    }
    .image > img {
      width: 470px;
    }
    .comments {
      padding: 10px 15px;
      background-color: #eee;
    }
    .comments .summary {
      width: 100%;
      border-bottom: 1px solid #ddd;
      padding-bottom: 10px;
      margin-bottom: 10px;
    }
    .comments > ul  {
      margin: 0;
    }
    .comment {
      margin-top: 5px;
      font-size: 13px;
    }
    .comment .avatar {
      width: 32px;
    }
    .comment > div {
      margin-left: 40px;
    }
    .reply > ul {
      margin: 10px 0 0 0;
    }
    .popup {
      z-index: 10000;
      border: 1px solid #ddd;
      position: absolute;
    }
    .yellow {
      background-color: #f5dfa3;
    }
    .red {
      background-color: #c5243a;
    }
    .blue {
      background-color: #476ebc;
    }
    .status .fa {
      float: left;
    }
    .status .action {
      margin-left: 20px;
      width: 210px;
    }
    .description {
      color: #222;
    }
    .grey {
      color: #888;
    }
    .page .tabContent {
      border-bottom: 2px solid darkgray;
    }
</style>
