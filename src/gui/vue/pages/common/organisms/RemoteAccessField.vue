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
  <v-layout>
    <v-combobox
      :hide-details="hideDetails"
      v-model="targetUrl"
      :items="urls"
      :label="$store.getters.message('remote-access.remote-connection-url')"
      id="connectUrlTextField"
      ref="urlField"
      :disabled="isCapturing"
    ></v-combobox>
    <v-btn
      :color="color"
      id="connecttButton"
      @click="connect()"
      :disabled="isCapturing || targetUrl === url"
      >{{ $store.getters.message("remote-access.connect") }}</v-btn
    >

    <information-message-dialog
      :opened="informationMessageDialogOpened"
      :title="informationTitle"
      :message="informationMessage"
      @close="informationMessageDialogOpened = false"
    />

    <error-message-dialog
      :opened="errorMessageDialogOpened"
      :message="errorMessage"
      @close="errorMessageDialogOpened = false"
    />
  </v-layout>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import ErrorMessageDialog from "@/vue/pages/common/ErrorMessageDialog.vue";
import InformationMessageDialog from "@/vue/pages/common/InformationMessageDialog.vue";

@Component({
  components: {
    "error-message-dialog": ErrorMessageDialog,
    "information-message-dialog": InformationMessageDialog,
  },
})
export default class RemoteAccessField extends Vue {
  @Prop({ type: String, default: "" }) public readonly color!: string;
  @Prop({ type: Boolean, default: false })
  public readonly hideDetails!: boolean;

  private informationMessageDialogOpened = false;
  private informationTitle = "";
  private informationMessage = "";
  private errorMessageDialogOpened = false;
  private errorMessage = "";
  private remoteUrl = "";
  private targetUrl = this.url;

  private get urls(): string[] {
    const localUrl = this.$store.state.localRepositoryServiceUrl;
    const remoteUrls = this.$store.state.remoteRepositoryUrls;
    return [localUrl, ...remoteUrls];
  }

  private get url(): string {
    return this.$store.state.repositoryContainer.serviceUrl;
  }

  private get isCapturing(): boolean {
    return this.$store.state.captureControl.isCapturing;
  }

  @Watch("url")
  private updateUrl() {
    this.targetUrl = this.url;
  }

  private connect(): void {
    (this.$refs.urlField as any).blur();
    this.$nextTick(() => {
      if (this.targetUrl) {
        this.startRemoteConnection(this.targetUrl);
      } else {
        console.warn("Target URL is empty.");
      }
    });
  }

  private async initialize(): Promise<void> {
    await this.$store.dispatch("loadLocaleFromSettings");
    await this.$store.dispatch("operationHistory/readSettings");
    await this.$store.dispatch("operationHistory/resetHistory");
    await this.$store.dispatch("captureControl/resetTimer");
    await this.$store.dispatch("testManagement/readDataFile");
  }

  private startRemoteConnection(targetUrl: string) {
    (async () => {
      this.$store.dispatch("openProgressDialog", {
        message: this.$store.getters.message(
          "remote-access.connecting-remote-url"
        ),
      });

      try {
        const url = await this.$store.dispatch("connectRemoteUrl", {
          targetUrl,
        });

        await this.initialize();

        this.informationMessageDialogOpened = true;
        this.informationTitle = this.$store.getters.message("common.confirm");
        this.informationMessage = this.$store.getters.message(
          "remote-access.connect-remote-url-succeeded",
          {
            url,
          }
        );
        this.remoteUrl = url;
      } catch (error) {
        if (error instanceof Error) {
          this.errorMessage = error.message;
          this.errorMessageDialogOpened = true;
        } else {
          throw error;
        }
      } finally {
        this.$store.dispatch("closeProgressDialog");
      }
    })();
  }
}
</script>
