<!--
 Copyright 2022 NTT Corporation.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

      http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
-->

<template>
  <v-layout row wrap justify-center align-start>
    <div class="main">
      <section>
        <input id="s1" type="checkbox" name="t1" />
        <label for="s1">{{
          $store.getters.message("manage-show.window-title")
        }}</label>
        <div class="content">
          <v-layout row wrap justify-center align-start>
            <div
              v-for="(legend, index) in legendInfos"
              v-bind:key="index"
              class="manage-show-legend"
            >
              <v-card class="pt-0 my-3">
                <v-card-title
                  primary-title
                  class="py-2 my-0"
                  v-bind:class="legend.class"
                >
                  <p class="card-center">{{ legend.status }}</p>
                </v-card-title>
              </v-card>
              <p>{{ legend.text }}</p>
            </div>
            <div class="manage-show-legend mt-4">
              {{ $store.getters.message("manage-show.legend1") }}<br />
              {{ $store.getters.message("manage-show.legend2") }}<br />
              {{ $store.getters.message("manage-show.legend3") }}<br />
            </div>
          </v-layout>
        </div>
      </section>
    </div>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";

@Component
export default class LegendViewer extends Vue {
  private get legendInfos(): {
    status: string;
    text: string;
    class: string;
  }[] {
    return [
      {
        status: this.$store.getters.message("manage-show.status-ok"),
        text: this.$store.getters.message("manage-show.text-ok"),
        class: "status-fine",
      },
      {
        status: this.$store.getters.message("manage-show.status-out-of-scope"),
        text: this.$store.getters.message("manage-show.text-out-of-scope"),
        class: "status-fine",
      },
      {
        status: this.$store.getters.message("manage-show.status-ng"),
        text: this.$store.getters.message("manage-show.text-ng"),
        class: "status-ng",
      },
      {
        status: this.$store.getters.message("manage-show.status-ongoing"),
        text: this.$store.getters.message("manage-show.text-ongoing"),
        class: "status-warn",
      },
      {
        status: this.$store.getters.message("manage-show.status-pending"),
        text: this.$store.getters.message("manage-show.text-pending"),
        class: "status-warn",
      },
    ];
  }
}
</script>

<style lang="sass" scoped>
.card-center
  margin: auto

.manage-show-legend
  margin: 0px 10px
  padding-top: 10px
  width: 140px
  color: #ffffff

.status-fine
  background-color: #DEF9CD,
  color: #690,
  font-weight: bold

.status-ng
  background-color: #FBE0E5
  color: #c00
  font-weight: bold

.status-warn
  background-color: #FBE9E0
  color: #EA5F1A
  font-weight: bold
.main
  section
    label
      cursor: pointer
      display: block
      padding: 15px 20px
      color: #fff
      position: relative
      font-size: 22px
      &::after
        content: "\271B"
        position: absolute
        right: 20px
        top: 50%
        transform: translateY(-50%)
        color: #fff
        opacity: 0.5
  .content
    visbililty: hidden
    max-height: 0
    overflow: hidden
    transition: all 0.8s ease
    padding: 0 20px
    *
      opacity: 0
      transition: all 0.8s ease
  input
    display: none
    &:checked +label+div
      visibility: visible
      max-height: 100vh
      opacity: 1
      *
        opacity: 1
    &:checked+label::after
      content: "\268A"
</style>
