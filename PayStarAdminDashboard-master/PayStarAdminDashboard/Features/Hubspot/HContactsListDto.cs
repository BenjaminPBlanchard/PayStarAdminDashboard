using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PayStarAdminDashboard.Features.Hubspot
{
    public class HContactsListDto
    {

        public class Rootobject
        {
            public Contact[] contacts { get; set; }
            public bool hasmore { get; set; }
            public int vidoffset { get; set; }
        }

        public class Contact
        {
            public long addedAt { get; set; }
            public int vid { get; set; }
            [JsonProperty("canonical-vid")]
            public int canonicalvid { get; set; }
            [JsonProperty("merged-vids")]
            public object[] mergedvids { get; set; }
            [JsonProperty("portal-id")]
            public int portalid { get; set; }
            [JsonProperty("is-contact")]
            public bool iscontact { get; set; }
            [JsonProperty("profile-token")]
            public string profiletoken { get; set; }
            [JsonProperty("profile-url")]
            public string profileurl { get; set; }
            public Properties properties { get; set; }
            [JsonProperty("form-submissions")]
            public object[] formsubmissions { get; set; }
            [JsonProperty("identity-profiles")]
            public IdentityProfiles[] identityprofiles { get; set; }
            [JsonProperty("merge-audits")]
            public object[] mergeaudits { get; set; }
        }

        public class Properties
        {
            public Firstname firstname { get; set; }
            public Lastmodifieddate lastmodifieddate { get; set; }
            public Company company { get; set; }
            public Lastname lastname { get; set; }
        }

        public class Firstname
        {
            public string value { get; set; }
        }

        public class Lastmodifieddate
        {
            public string value { get; set; }
        }

        public class Company
        {
            public string value { get; set; }
        }

        public class Lastname
        {
            public string value { get; set; }
        }

        public class IdentityProfiles
        {
            public int vid { get; set; }
            [JsonProperty("saved-at-timestamp")]
            public long savedattimestamp { get; set; }
            [JsonProperty("deleted-changed-timestamp")]
            public int deletedchangedtimestamp { get; set; }
            public Identity[] identities { get; set; }
        }

        public class Identity
        {
            public string type { get; set; }
            public string value { get; set; }
            public long timestamp { get; set; }
            public bool isprimary { get; set; }
        }

    }
}
