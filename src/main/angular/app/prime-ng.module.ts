import { NgModule } from '@angular/core';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ToolbarModule } from 'primeng/toolbar';
import { MenuModule } from 'primeng/menu';
import { MegaMenuModule } from 'primeng/megamenu';
import { TabMenuModule } from 'primeng/tabmenu';
import { ProgressBarModule } from 'primeng/progressbar';
import { RatingModule } from 'primeng/rating';
import { FullCalendarModule } from 'primeng/fullcalendar';
import { ToastModule } from 'primeng/toast';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import {MultiSelectModule} from 'primeng/multiselect';
import {DataViewModule} from 'primeng/dataview';
import {FileUploadModule} from 'primeng/fileupload';
import {CalendarModule} from 'primeng/calendar';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {SliderModule} from 'primeng/slider';
import {SpinnerModule} from 'primeng/spinner';
import {PanelMenuModule} from 'primeng/panelmenu';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import {KeyFilterModule} from 'primeng/keyfilter';
import {DropdownModule} from 'primeng/dropdown';
import {InputMaskModule} from 'primeng/inputmask';
import {RadioButtonModule} from 'primeng/radiobutton';
import {ToggleButtonModule} from 'primeng/togglebutton';
import {TabViewModule} from 'primeng/tabview';

@NgModule({
    exports: [
        CardModule,
        InputTextModule,
        CheckboxModule,
        ButtonModule,
        TieredMenuModule,
        ToolbarModule,
        MenuModule,
        MegaMenuModule,
        TabMenuModule,
        ProgressBarModule,
        RatingModule,
        FullCalendarModule,
        ToastModule,
        MessagesModule,
        MessageModule,
        MultiSelectModule,
        DataViewModule,
        CalendarModule,
        FileUploadModule,
        InputTextareaModule,
        SliderModule,
        SpinnerModule,
        PanelMenuModule,
        ConfirmDialogModule,
        KeyFilterModule,
        DropdownModule,
        InputMaskModule,
        RadioButtonModule,
        ToggleButtonModule,
        TabViewModule
    ],
    providers: []
})
export class PrimeNgModule { }
