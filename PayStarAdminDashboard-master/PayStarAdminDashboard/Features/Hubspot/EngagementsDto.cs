using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PayStarAdminDashboard.Features.Hubspot
{
    public class EngagementsDto
    {
        public class Rootobject
        {
            public Result[] results { get; set; }
            public bool hasMore { get; set; }
            public int offset { get; set; }
            public int total { get; set; }
        }

        public class Result
        {
            public Engagement engagement { get; set; }
            public Associations associations { get; set; }
            public object[] attachments { get; set; }
            public Scheduledtask[] scheduledTasks { get; set; }
            public Metadata metadata { get; set; }
        }

        public class Engagement
        {
            public long id { get; set; }
            public int portalId { get; set; }
            public bool active { get; set; }
            public long createdAt { get; set; }
            public long lastUpdated { get; set; }
            public int createdBy { get; set; }
            public int modifiedBy { get; set; }
            public int ownerId { get; set; }
            public string type { get; set; }
            public long timestamp { get; set; }
            public string source { get; set; }
            public string sourceId { get; set; }
            public object[] allAccessibleTeamIds { get; set; }
            public string bodyPreview { get; set; }
            public object[] queueMembershipIds { get; set; }
            public bool bodyPreviewIsTruncated { get; set; }
            public string bodyPreviewHtml { get; set; }
            public bool gdprDeleted { get; set; }
            public string uid { get; set; }
        }

        public class Associations
        {
            public int[] contactIds { get; set; }
            public long[] companyIds { get; set; }
            public object[] dealIds { get; set; }
            public object[] ownerIds { get; set; }
            public object[] workflowIds { get; set; }
            public object[] ticketIds { get; set; }
            public object[] contentIds { get; set; }
            public object[] quoteIds { get; set; }
        }

        public class Metadata
        {
            public string body { get; set; }
            public string status { get; set; }
            public string subject { get; set; }
            public string taskType { get; set; }
            public long[] reminders { get; set; }
            public bool sendDefaultReminder { get; set; }
            public string priority { get; set; }
            public bool isAllDay { get; set; }
            public long startTime { get; set; }
            public long endTime { get; set; }
            public string title { get; set; }
            public string source { get; set; }
            public object[] preMeetingProspectReminders { get; set; }
            public string meetingOutcome { get; set; }
            public From from { get; set; }
            public To[] to { get; set; }
            public object[] cc { get; set; }
            public object[] bcc { get; set; }
            public Sender sender { get; set; }
            public string html { get; set; }
            public string messageId { get; set; }
            public string threadId { get; set; }
            public Emailsendeventid emailSendEventId { get; set; }
            public string loggedFrom { get; set; }
            public object[] validationSkipped { get; set; }
            public string mediaProcessingStatus { get; set; }
            public bool attachedVideoOpened { get; set; }
            public bool attachedVideoWatched { get; set; }
            public string toNumber { get; set; }
            public string fromNumber { get; set; }
            public string externalId { get; set; }
            public string externalAccountId { get; set; }
            public string calleeObjectType { get; set; }
            public int calleeObjectId { get; set; }
            public string text { get; set; }
            public string trackerKey { get; set; }
            public string sentVia { get; set; }
            public string facsimileSendId { get; set; }
            public string postSendStatus { get; set; }
        }

        public class From
        {
            public string raw { get; set; }
            public string email { get; set; }
            public string firstName { get; set; }
            public string lastName { get; set; }
        }

        public class Sender
        {
            public string email { get; set; }
        }

        public class Emailsendeventid
        {
        }

        public class To
        {
            public string raw { get; set; }
            public string email { get; set; }
            public string firstName { get; set; }
            public string lastName { get; set; }
        }

        public class Scheduledtask
        {
            public long engagementId { get; set; }
            public int portalId { get; set; }
            public string engagementType { get; set; }
            public string taskType { get; set; }
            public long timestamp { get; set; }
            public string uuid { get; set; }
        }



    }
}